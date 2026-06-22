// Post slugs suppressed from every public surface pending content review.
// Reversible: remove a slug to restore the post (assuming its DB row is still PUBLISHED).
export const SUPPRESSED_POST_SLUGS = ['parallel-tracks']

export function isSuppressedSlug(slug: string): boolean {
  return SUPPRESSED_POST_SLUGS.includes(slug)
}
