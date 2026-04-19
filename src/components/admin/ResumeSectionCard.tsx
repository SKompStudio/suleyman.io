import Link from 'next/link'

type Item = { id: string; primary: string; secondary: string; visible: boolean }

export function ResumeSectionCard({
  title,
  items,
  newHref,
  baseHref,
}: {
  title: string
  items: Item[]
  newHref: string
  baseHref: string
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {title} <span className="ml-1 text-sm text-zinc-400">· {items.length}</span>
        </h2>
        <Link href={newHref} className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400">
          + New
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No entries yet. Add one to see it on /resume.</p>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <Link href={`${baseHref}/${item.id}`} className="min-w-0 flex-1 hover:underline">
                <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.primary}</div>
                <div className="truncate text-xs text-zinc-500">{item.secondary}</div>
              </Link>
              {!item.visible && (
                <span className="ml-3 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  hidden
                </span>
              )}
            </li>
          ))}
          {items.length > 5 && (
            <li className="pt-2 text-xs text-zinc-500">+ {items.length - 5} more</li>
          )}
        </ul>
      )}
    </div>
  )
}
