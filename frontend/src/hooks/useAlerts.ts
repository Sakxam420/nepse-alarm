import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { PriceAlert, TriggeredAlertItem, AlertCondition } from '../types/stock';
import { soundSynthesizer } from '../utils/audioAlarm';
import { sendDesktopNotification, requestNotificationPermission } from '../utils/notificationService';

const getApiBase = () => {
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';
};

const STORAGE_ALERTS_KEY = 'nepse_price_alerts';
const STORAGE_TRIGGERED_KEY = 'nepse_triggered_alerts_history';

interface UseAlertsOptions {
  onAlertTriggered?: (item: TriggeredAlertItem) => void;
}

export function useAlerts(options?: UseAlertsOptions) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALERTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [triggeredHistory, setTriggeredHistory] = useState<TriggeredAlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRIGGERED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundSynthesizer.isEnabled());
  const [loading, setLoading] = useState<boolean>(false);
  const lastCheckedRef = useRef<number>(0);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRIGGERED_KEY, JSON.stringify(triggeredHistory));
    } catch {}
  }, [triggeredHistory]);

  const toggleSound = useCallback(() => {
    const updated = soundSynthesizer.toggle();
    setSoundEnabled(updated);
  }, []);

  // Fetch alerts from backend
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await axios.get(`${getApiBase()}/alerts`, { timeout: 3500 });
      if (Array.isArray(res.data)) {
        setAlerts(res.data);
      }
    } catch {
      // Keep local state if backend is offline
    }
  }, []);

  // Create an alert
  const addAlert = useCallback(
    async (symbol: string, condition: AlertCondition, targetValue: number, note?: string) => {
      setLoading(true);
      const tempId = Date.now().toString();
      const localItem: PriceAlert = {
        id: tempId,
        symbol: symbol.toUpperCase(),
        condition,
        targetValue,
        note,
        createdAt: new Date().toLocaleDateString(),
        isActive: true,
        triggered: false,
      };

      try {
        const res = await axios.post(`${getApiBase()}/alerts`, {
          symbol: symbol.toUpperCase(),
          condition,
          targetValue,
          note,
        }, { timeout: 4000 });

        if (res.data && res.data.id) {
          setAlerts(prev => [res.data, ...prev.filter(a => a.id !== tempId)]);
        }
      } catch {
        // Fallback to local storage
        setAlerts(prev => [localItem, ...prev]);
      } finally {
        setLoading(false);
      }
      requestNotificationPermission();
    },
    [],
  );

  // Delete an alert
  const deleteAlert = useCallback(async (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    try {
      await axios.delete(`${getApiBase()}/alerts/${id}`, { timeout: 3000 });
    } catch {}
  }, []);

  // Toggle active state
  const toggleAlert = useCallback(async (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive, triggered: a.isActive ? a.triggered : false } : a)),
    );
    try {
      await axios.patch(`${getApiBase()}/alerts/${id}/toggle`, {}, { timeout: 3000 });
    } catch {}
  }, []);

  // Process newly triggered items
  const handleNewlyTriggered = useCallback(
    (newTriggers: TriggeredAlertItem[]) => {
      if (newTriggers.length === 0) return;

      soundSynthesizer.playChime();
      setUnreadCount(prev => prev + newTriggers.length);
      setTriggeredHistory(prev => [...newTriggers, ...prev].slice(0, 50));

      for (const item of newTriggers) {
        sendDesktopNotification(`NEPSE Alert: ${item.symbol}`, {
          body: item.message,
          tag: item.alertId,
        });
        if (options?.onAlertTriggered) {
          options.onAlertTriggered(item);
        }
      }
    },
    [options],
  );

  // Evaluate alerts on the backend or locally
  const evaluateAlerts = useCallback(
    async (latestPricesMap?: Map<string, { price: number; rsi?: number; macdHist?: number; changePct?: number }>) => {
      // Throttle evaluations to once every 10 seconds
      const now = Date.now();
      if (now - lastCheckedRef.current < 10000) return;
      lastCheckedRef.current = now;

      try {
        const res = await axios.post(`${getApiBase()}/alerts/evaluate`, {}, { timeout: 4000 });
        if (res.data?.triggered && Array.isArray(res.data.triggered)) {
          const items: TriggeredAlertItem[] = res.data.triggered;
          if (items.length > 0) {
            handleNewlyTriggered(items);
            // Refresh local alerts list
            fetchAlerts();
            return;
          }
        }
      } catch {
        // Local evaluation fallback if backend is offline
        if (latestPricesMap && latestPricesMap.size > 0) {
          const triggeredLocal: TriggeredAlertItem[] = [];

          setAlerts(prev => {
            return prev.map(alert => {
              if (!alert.isActive || alert.triggered) return alert;

              const data = latestPricesMap.get(alert.symbol);
              if (!data) return alert;

              let isTriggered = false;
              let msg = '';

              switch (alert.condition) {
                case 'ABOVE':
                  if (data.price >= alert.targetValue) {
                    isTriggered = true;
                    msg = `${alert.symbol} rose ABOVE target Rs. ${alert.targetValue} (Current: Rs. ${data.price.toFixed(2)})`;
                  }
                  break;
                case 'BELOW':
                  if (data.price <= alert.targetValue) {
                    isTriggered = true;
                    msg = `${alert.symbol} dropped BELOW target Rs. ${alert.targetValue} (Current: Rs. ${data.price.toFixed(2)})`;
                  }
                  break;
                case 'RSI_OVERSOLD':
                  if ((data.rsi ?? 50) <= alert.targetValue) {
                    isTriggered = true;
                    msg = `${alert.symbol} RSI Oversold at ${(data.rsi ?? 50).toFixed(1)}`;
                  }
                  break;
                case 'RSI_OVERBOUGHT':
                  if ((data.rsi ?? 50) >= alert.targetValue) {
                    isTriggered = true;
                    msg = `${alert.symbol} RSI Overbought at ${(data.rsi ?? 50).toFixed(1)}`;
                  }
                  break;
              }

              if (isTriggered) {
                const item: TriggeredAlertItem = {
                  alertId: alert.id,
                  symbol: alert.symbol,
                  condition: alert.condition,
                  targetValue: alert.targetValue,
                  currentValue: data.price,
                  message: msg,
                  triggeredAt: new Date().toLocaleTimeString(),
                };
                triggeredLocal.push(item);
                return { ...alert, isActive: false, triggered: true, triggeredAt: new Date().toISOString() };
              }
              return alert;
            });
          });

          if (triggeredLocal.length > 0) {
            handleNewlyTriggered(triggeredLocal);
          }
        }
      }
    },
    [fetchAlerts, handleNewlyTriggered],
  );

  const clearTriggeredHistory = useCallback(() => {
    setTriggeredHistory([]);
    setUnreadCount(0);
  }, []);

  const markTriggeredAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Auto-poll evaluation every 30 seconds
    const interval = setInterval(() => {
      evaluateAlerts();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts, evaluateAlerts]);

  return {
    alerts,
    triggeredHistory,
    unreadCount,
    soundEnabled,
    loading,
    toggleSound,
    addAlert,
    deleteAlert,
    toggleAlert,
    evaluateAlerts,
    clearTriggeredHistory,
    markTriggeredAsRead,
  };
}
