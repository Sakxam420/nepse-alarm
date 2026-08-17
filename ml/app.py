from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from models.hybrid_model import HybridModel

app = FastAPI(
    title="NEPSE AI Stock Prediction ML Service",
    description="LSTM + XGBoost Hybrid Model inference engine",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache of trained models by symbol to avoid reloading weights constantly
models_cache: Dict[str, HybridModel] = {}

class PriceBar(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: float
    rsi14: float | None = 0.0
    macdLine: float | None = 0.0
    macdSignal: float | None = 0.0
    macdHist: float | None = 0.0
    ema12: float | None = 0.0
    ema26: float | None = 0.0
    ema50: float | None = 0.0
    volumeDelta: float | None = 0.0

class PredictRequest(BaseModel):
    symbol: str
    history: List[PriceBar]

class TrainRequest(BaseModel):
    symbol: str
    history: List[PriceBar]

def get_or_create_model(symbol: str) -> HybridModel:
    symbol = symbol.upper()
    if symbol not in models_cache:
        models_cache[symbol] = HybridModel(symbol=symbol)
    return models_cache[symbol]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "nepse-ml-service"}

@app.post("/predict")
def predict(request: PredictRequest):
    if not request.history:
        raise HTTPException(status_code=400, detail="Price history sequence cannot be empty.")
    
    # Convert Pydantic objects to dictionary list
    history_list = [bar.model_dump() for bar in request.history]
    
    # Get model and predict
    model = get_or_create_model(request.symbol)
    prediction = model.predict(history_list)
    return prediction

@app.post("/train")
def train(request: TrainRequest):
    if len(request.history) < 35:
        raise HTTPException(
            status_code=400, 
            detail="Insufficient historical records for training. A minimum of 35 trading days is required."
        )
    
    history_list = [bar.model_dump() for bar in request.history]
    model = get_or_create_model(request.symbol)
    
    train_result = model.train(history_list)
    if not train_result["success"]:
        raise HTTPException(status_code=500, detail=train_result["message"])
        
    return train_result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
