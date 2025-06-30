from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from utils.fetch_data import fetch_dod_contracts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DefenseSpend API is live"}

@app.get("/contracts")
def get_contracts(year: int = Query(2023)):
    return {"results": fetch_dod_contracts(year=year)}
