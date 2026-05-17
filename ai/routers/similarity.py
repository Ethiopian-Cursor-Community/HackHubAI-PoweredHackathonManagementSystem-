from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()


class SubmissionItem(BaseModel):
    id: int
    project_title: str = ""
    description: str = ""


class SimilarityRequest(BaseModel):
    hackathonId: int
    submissions: list[SubmissionItem] = []


@router.post("/check")
async def similarity_check(req: SimilarityRequest):
    if len(req.submissions) < 2:
        return {"pairs": [], "message": "Need at least 2 submissions to compare"}

    descriptions = [s.description for s in req.submissions]
    
    vectorizer = TfidfVectorizer(stop_words="english", max_features=500)
    tfidf_matrix = vectorizer.fit_transform(descriptions)
    sim_matrix = cosine_similarity(tfidf_matrix)

    pairs = []
    for i in range(len(req.submissions)):
        for j in range(i + 1, len(req.submissions)):
            score = float(sim_matrix[i][j])
            if score > 0.3:  # Flag pairs with >30% similarity
                pairs.append({
                    "submission1_id": req.submissions[i].id,
                    "submission2_id": req.submissions[j].id,
                    "similarity_score": round(score, 3),
                    "flagged": score > 0.7,
                })

    pairs.sort(key=lambda x: x["similarity_score"], reverse=True)
    return {"pairs": pairs}