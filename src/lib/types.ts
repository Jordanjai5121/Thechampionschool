export type Programme = {
  id?: string; slug: string; title: string; tagline: string; theme: string; summary: string
  poster_url: string; hero_url: string; points: string[]; objectives: string[]; outcomes: string[]
  published: boolean; sort: number; icon?: string
}
export type GalleryItem = {
  id?: string; category: string; kind: 'image' | 'video'; title: string; url: string
  poster_url?: string | null; published: boolean; sort: number
}
export type Announcement = { id: string; title: string; body: string | null; published: boolean; created_at: string }
export type Job = {
  id: string; title: string; department: string | null; job_type: string | null; location: string | null
  description: string | null; requirements: string | null; last_date: string | null; published: boolean; created_at: string
}
export type Status = 'new' | 'pending' | 'completed'
