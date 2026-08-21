// Safely reads a fetch Response as JSON without throwing if the upstream
// service (NVIDIA, in our case) returns something that isn't valid JSON —
// an HTML error page, a truncated response, etc. Logs the raw response
// server-side so we can actually see what went wrong, without ever
// exposing that raw text to the client.
export async function safeParseJSON(response: Response, label: string) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    console.error(`[${label}] Non-JSON response (first 500 chars):`, text.slice(0, 500))
    return null
  }
}