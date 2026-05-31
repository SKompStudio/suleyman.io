// Optional static texture for depth. Own overflow:clip layer, pointer-events
// none, fixed behind content, never animated. No claim attached.

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-clip opacity-[0.025] dark:opacity-[0.04]"
    >
      <svg className="h-full w-full">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}
