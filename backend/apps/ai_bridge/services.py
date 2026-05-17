import json
import os
from urllib import error, request


AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
AI_SERVICE_TIMEOUT = int(os.getenv("AI_SERVICE_TIMEOUT", "8"))


def _post_json(path, payload):
    url = f"{AI_SERVICE_URL.rstrip('/')}/{path.lstrip('/')}"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=AI_SERVICE_TIMEOUT) as resp:
            return json.loads(resp.read().decode("utf-8")), None
    except (error.URLError, error.HTTPError, TimeoutError) as exc:
        return None, str(exc)


def evaluate_submission(payload):
    return _post_json("/evaluate/submission", payload)


def team_match(payload):
    return _post_json("/match/teams", payload)


def similarity_check(payload):
    return _post_json("/similarity/check", payload)
