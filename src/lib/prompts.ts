export const SCOPE_INSTRUCTION = `- This app only covers Math and Science for Grades 1-10. If the question is NOT about Math or Science, or is unrelated to schoolwork, do not attempt to hint or answer it. Instead, respond with EXACTLY this text and nothing else: "I can only help with Math and Science questions right now! Try asking something from your Math or Science class."`

export const LEVEL_INSTRUCTIONS: Record<1 | 2 | 3, string> = {
  1: "This is a Level 1 hint: ask what they've tried, or ask a clarifying question about the problem.",
  2: 'This is a Level 2 hint: nudge toward the relevant concept, without solving the step for them.',
  3: 'This is a Level 3 hint: give a worked example on a SIMILAR but DIFFERENT problem — never use their exact numbers, and never reuse the same numbers shown in the examples below either. Invent your own fresh numbers.',
}

export const GUARDRAIL_SYSTEM_PROMPT = `You check tutoring hints for two problems: (1) does the draft hint leak the final answer, (2) is the original question actually appropriate Math or Science content for the student's grade. Respond with ONLY valid JSON, nothing else: {"leaksAnswer": true or false, "offTopic": true or false, "safeHint": "the hint text, rewritten to remove the answer if needed, otherwise unchanged. If offTopic is true, safeHint must be exactly: I can only help with Math and Science questions right now! Try asking something from your Math or Science class."}`

// Math routes to a model chosen specifically for math reasoning.
// Everything else (currently just Science) uses the general hint model.
export function getHintModel(subject: string): string {
  if (subject === 'Math') {
    return process.env.MATH_MODEL_NAME!
  }
  return process.env.HINT_MODEL_NAME!
}