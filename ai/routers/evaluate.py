import os
from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class EvaluationRequest(BaseModel):
    projectTitle: str
    description: str
    githubUrl: str = ""
    techStack: list[str] = []


@router.post("/submission")
async def evaluate_submission(req: EvaluationRequest):
    prompt = f"""
Evaluate the following hackathon project submission:

Title: {req.projectTitle}
Description: {req.description}
Tech Stack: {', '.join(req.techStack)}

Score each dimension from 0-100:
1. Innovation Score - novelty, uniqueness, creative use of technology
2. Documentation Score - clarity, completeness, setup instructions
3. Complexity Score - technical depth, architecture quality

Return JSON with: innovationScore, documentationScore, complexityScore, overallScore, summary, suggestions
"""
    try:
        resp = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        content = resp.choices[0].message.content
        import json
        result = json.loads(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))