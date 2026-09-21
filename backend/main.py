"""API del hackathon. Arranca con: uvicorn main:app --reload --port 8000

Este archivo SOLO monta la app y registra los routers. La logica de cada endpoint
vive en backend/routers/. No anadas endpoints aqui: crea o edita el router que toque
(ver docs/OWNERSHIP.md). Asi los dos podemos trabajar sin pisarnos.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import inventory, profile, receipt, recipes, shopping

app = FastAPI(title="Smart Fridge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    # Permite abrir la demo desde el movil via la IP de la LAN del portatil.
    allow_origin_regex=r"http://(\d{1,3}\.){3}\d{1,3}:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory.router)
app.include_router(receipt.router)
app.include_router(recipes.router)
app.include_router(profile.router)
app.include_router(shopping.router)


@app.get("/")
def health():
    return {"status": "ok", "service": "smart-fridge-api"}
