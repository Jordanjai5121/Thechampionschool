import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from './supabase'
import { DEFAULT_GALLERY, DEFAULT_PROGRAMMES, DEFAULT_SETTINGS, type Settings } from './seed'
import type { Announcement, GalleryItem, Job, Programme } from './types'

// Public pages read from Supabase when configured. If the database has no rows yet (or is not
// configured) the built-in school content is shown so the site is never empty.

function merge<T extends Record<string, any>>(base: T, over: any): T {
  if (!over || typeof over !== 'object') return base
  const out: any = { ...base }
  for (const k of Object.keys(over)) {
    const b = (base as any)[k]
    out[k] = b && typeof b === 'object' && !Array.isArray(b) && typeof over[k] === 'object' && !Array.isArray(over[k]) ? merge(b, over[k]) : over[k]
  }
  return out
}

function useAsync<T>(load: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    load().then((d) => alive && setData(d)).catch(() => {}).finally(() => alive && setLoading(false))
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { data, loading }
}

export function useSettings() {
  return useAsync<Settings>(async () => {
    if (!supabaseConfigured) return DEFAULT_SETTINGS
    const { data } = await supabase.from('site_settings').select('key,value')
    const o: Record<string, unknown> = {}
    ;(data ?? []).forEach((r: any) => { o[r.key] = r.value })
    return merge(DEFAULT_SETTINGS, o)
  }, DEFAULT_SETTINGS)
}

export function useProgrammes() {
  return useAsync<Programme[]>(async () => {
    if (!supabaseConfigured) return DEFAULT_PROGRAMMES
    const { data, error } = await supabase.from('programmes').select('*').eq('published', true).order('sort')
    if (error) return DEFAULT_PROGRAMMES
    return data && data.length ? (data as Programme[]).map((r) => ({ ...r, icon: r.icon ?? DEFAULT_PROGRAMMES.find((d) => d.slug === r.slug)?.icon })) : DEFAULT_PROGRAMMES
  }, DEFAULT_PROGRAMMES)
}

export function useGallery() {
  return useAsync<GalleryItem[]>(async () => {
    if (!supabaseConfigured) return DEFAULT_GALLERY
    const { data, error } = await supabase.from('gallery_items').select('*').eq('published', true).order('sort').order('created_at')
    if (error) return DEFAULT_GALLERY
    return data && data.length ? (data as GalleryItem[]) : DEFAULT_GALLERY
  }, DEFAULT_GALLERY)
}

export function useAnnouncements() {
  return useAsync<Announcement[]>(async () => {
    if (!supabaseConfigured) return []
    const { data } = await supabase.from('announcements').select('*').eq('published', true).order('created_at', { ascending: false }).limit(5)
    return (data ?? []) as Announcement[]
  }, [])
}

export function useJobs() {
  return useAsync<Job[]>(async () => {
    if (!supabaseConfigured) return []
    const { data } = await supabase.from('jobs').select('*').eq('published', true).order('created_at', { ascending: false })
    return (data ?? []) as Job[]
  }, [])
}
