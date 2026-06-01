// Page-local helper: estimate reading time + word count from real article body.
// No fabricated numbers — derived directly from the rendered markdown source.

export function articleStats(body: string): { words: number; minutes: number } {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-\[\]()|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 220))
  return { words, minutes }
}
