import json
import os
from urllib import error, request


AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
AI_SERVICE_TIMEOUT = int(os.getenv("AI_SERVICE_TIMEOUT", "8"))
AGENT_SDK_URL = os.getenv("AGENT_SDK_URL", "http://localhost:8787")
AGENT_SDK_TIMEOUT = int(os.getenv("AGENT_SDK_TIMEOUT", "20"))


def _post_json(path, payload, mock_response=None):
    url = f"{AI_SERVICE_URL.rstrip('/')}/{path.lstrip('/')}"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=AI_SERVICE_TIMEOUT) as resp:
            return json.loads(resp.read().decode("utf-8")), None
    except (error.URLError, error.HTTPError, TimeoutError) as exc:
        if mock_response is not None:
            return mock_response, None
        return None, str(exc)


def evaluate_submission(payload):
    mock = {
        "score": 85,
        "feedback": "Great project! The idea is solid and well-executed. Consider adding more test coverage and improving the UI.",
        "strengths": ["Innovation", "Clean Code"],
        "weaknesses": ["Lack of Testing", "Basic UI"]
    }
    return _post_json("/evaluate/submission", payload, mock)


def team_match(payload):
    mock = [{"userId": 1, "matchScore": 90, "reason": "Complementary skills in frontend and backend."}]
    return _post_json("/match/teams", payload, mock)


def similarity_check(payload):
    mock = []
    return _post_json("/similarity/check", payload, mock)


def _post_agent_json(path, payload, mock_response=None):
    url = f"{AGENT_SDK_URL.rstrip('/')}/{path.lstrip('/')}"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=AGENT_SDK_TIMEOUT) as resp:
            return json.loads(resp.read().decode("utf-8")), None
    except (error.URLError, error.HTTPError, TimeoutError) as exc:
        if mock_response is not None:
            return mock_response, None
        return None, str(exc)


def cursor_agent_prompt(payload):
    mock = {"response": "Mocked response from Cursor Agent."}
    return _post_agent_json("/agent/prompt", payload, mock)
