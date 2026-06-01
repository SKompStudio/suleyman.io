import { Container } from '@/components/Container'
import { fetchInstagramMedia, type IgPost } from '@/lib/fetchInstagram'
import { SocialFeed } from '@/components/social/SocialFeed'

export const metadata = {
  title: 'Social',
  description:
    'A live Instagram feed via the Instagram Graph API, plus the other services this site integrates with.',
}

export const revalidate = 3600

export default async function Social() {
  let posts: IgPost[] = []
  let status: 'ok' | 'offline' = 'ok'
  try {
    const res = await fetchInstagramMedia()
    posts = (res?.data ?? []).filter((p) => Boolean(p.media_url || p.thumbnail_url))
    if (posts.length === 0) status = 'offline'
  } catch {
    status = 'offline'
  }

  return (
    <Container className="relative z-10 mt-16 overflow-x-clip sm:mt-24">
      <SocialFeed posts={posts} status={status} />
    </Container>
  )
}
