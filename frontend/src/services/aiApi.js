import { request } from "./http";

export function cursorAgentPrompt(prompt, cwd = "") {
  return request("/ai/cursor/prompt/", {
    method: "POST",
    body: JSON.stringify({ prompt, cwd })
  });
}
