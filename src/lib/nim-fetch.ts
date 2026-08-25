export async function safeParseJSON(response: Response, label: string) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    console.error(`[${label}] Non-JSON response (first 500 chars):`, text.slice(0, 500))
    return null
  }
}

// Calls NVIDIA with a hard timeout and logs exactly how long it took.
// Every caller gets the same consistent { ok, data/error } shape back,
// whether it succeeded, errored, or timed out.
export async function fetchNIM(
  model: string,
  messages: { role: string; content: string }[],
  label: string,
  timeoutMs = 45000
) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const start = Date.now()

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages }),
      signal: controller.signal,
    })

    console.log(`[${label}] responded in ${Date.now() - start}ms (status ${response.status})`)

    const data = await safeParseJSON(response, label)
    if (!response.ok || !data) {
      console.error(`[${label}] NVIDIA API error:`, response.status, JSON.stringify(data))
      return { ok: false as const, status: response.status || 502 }
    }
    return { ok: true as const, data }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error(`[${label}] Timed out after ${Date.now() - start}ms (limit: ${timeoutMs}ms)`)
      return { ok: false as const, status: 504 }
    }
    console.error(`[${label}] Network error after ${Date.now() - start}ms:`, err)
    return { ok: false as const, status: 502 }
  } finally {
    clearTimeout(timeout)
  }
}