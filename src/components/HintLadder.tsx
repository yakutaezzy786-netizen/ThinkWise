export default function HintLadder({ currentLevel }: { currentLevel: number }) {
  const levels = [1, 2, 3, 4]
  const labels = ['Nudge', 'Concept', 'Example', 'Answer']

  return (
    <div className="flex items-end gap-2 mb-6" aria-label={`Hint level ${currentLevel} of 4`}>
      {levels.map((level) => {
        const isDone = level < currentLevel
        const isCurrent = level === currentLevel
        return (
          <div key={level} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={`w-full rounded-t-lg transition-all ${
                isCurrent ? 'bg-spark' : isDone ? 'bg-growth' : 'bg-border'
              }`}
              style={{ height: `${12 + level * 8}px` }}
            />
            <span className={`font-[family-name:var(--font-mono-ui)] text-[10px] uppercase tracking-wide ${
              isCurrent ? 'text-ink font-bold' : level > currentLevel ? 'text-muted' : 'text-growth-dark'
            }`}>
              {labels[level - 1]}
            </span>
          </div>
        )
      })}
    </div>
  )
}