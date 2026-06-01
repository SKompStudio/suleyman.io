const INSTAGRAM_GRAPH_API_URL = 'https://graph.instagram.com'

export type IgPost = {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

// Instagram API with Instagram Login (graph.instagram.com /me/media).
// Cached at the fetch layer so a valid token isn't hit on every request, and a
// later token expiry still serves the last-good feed until revalidation.
export async function fetchInstagramMedia(): Promise<{ data: IgPost[] }> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN is missing')
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
  const url = `${INSTAGRAM_GRAPH_API_URL}/me/media?fields=${fields}&access_token=${accessToken}`

  const res = await fetch(url, { next: { revalidate: 3600, tags: ['instagram'] } })
  const data = await res.json()
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || `Instagram API ${res.status}`)
  }
  return data
}
