export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return Response.json(body, init);
}

export function jsonError(message: string, status: number): Response {
  return jsonResponse({ error: message }, { status });
}
