"""
HackHub AI Service — FastAPI microservice
Provides: team matching, submission evaluation, similarity detection
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import evaluate, matching, similarity

load_dotenv()

app = FastAPI(
    title="HackHub AI Service",
    version="1.0.0",
    description="AI-powered hackathon management: team matching, project evaluation, similarity detection",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluate.router, prefix="/evaluate", tags=["Evaluation"])
app.include_router(matching.router, prefix="/match", tags=["Team Matching"])
app.include_router(similarity.router, prefix="/similarity", tags=["Similarity"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "hackhub-ai"}