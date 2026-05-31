// A single restrained hero motion moment: a slate -> green gradient hairline
// that slowly sweeps. Fixed 1px height (never shifts layout), sits below the
// LCP headline (never delays it), and the global reduced-motion floor freezes
// the sweep to a static gradient.

export function HeroHairline() {
  return (
    <div
      aria-hidden
      className="mt-8 h-px w-full max-w-xl animate-hairline-sweep rounded-full"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, #6E8BD0 35%, #3FB68B 65%, transparent 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}
