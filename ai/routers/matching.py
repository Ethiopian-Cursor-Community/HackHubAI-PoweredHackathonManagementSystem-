import os
from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class TeamMatchRequest(BaseModel):
    hackathonId: int
    requestingUserId: int
    skills: list[str] = []
    participantIds: list[int] = []


@router.post("/teams")
async def team_match(req: TeamMatchRequest):
    prompt = f"""
Given a hackathon participant with skills: {', '.join(req.skills) if req.skills else 'Not specified'}
And participant IDs: {req.participantIds}

Suggest optimal team compositions considering:
1. Skill complementarity and balance
2. Team size (ideal 3-5 members)
3. Role diversity

Return JSON with: suggestions (array of {teamId: int, members: [userId], matchScore: int, reasoning: str})
"""
    try:
        resp = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
        import json
        return json.loads(resp.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))