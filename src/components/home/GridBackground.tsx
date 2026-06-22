// Fixed HUD texture for the homepage: a very-low-alpha cyan grid radially
// masked to fade away from the upper-right focal area, plus two soft static
// radial glows (cyan upper-right, faint gold lower-left). All static, no
// animation, pointer-events none, behind content, in their own layer. No
// blurred positioned circles (those break iOS scroll) and no backdrop-filter.

export function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-clip">
      {/* two soft radial washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1100px 620px at 78% -8%, rgba(91,200,255,0.10), transparent 60%), radial-gradient(900px 600px at -6% 108%, rgba(232,184,75,0.05), transparent 55%)',
        }}
      />
      {/* masked cyan grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(91,200,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(91,200,255,0.035) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          WebkitMaskImage:
            'radial-gradient(1200px 700px at 70% 0%, #000 35%, transparent 78%)',
          maskImage:
            'radial-gradient(1200px 700px at 70% 0%, #000 35%, transparent 78%)',
        }}
      />
    </div>
  )
}
