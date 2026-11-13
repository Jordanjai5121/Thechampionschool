import { useState } from 'react'
import { Eye, EyeOff, Pencil, Plus, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORIES, DEFAULT_GALLERY, DEFAULT_PROGRAMMES } from '../lib/seed'
import { useRows } from './Inbox'

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, '_')}`
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error(error.message)
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

export function FileInput({ value, onChange, accept, folder, onKind }: { value?: string | null; onChange: (url: string) => void; accept: string; folder: string; onKind?: (k: 'image' | 'video') => void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    if (f.size > 50 * 1024 * 1024) return setErr('File is larger than 50 MB.')
    setBusy(true); setErr('')
    try { onChange(await uploadMedia(f, folder)); onKind?.(f.type.startsWith('video') ? 'video' : 'image') } catch (x: any) { setErr(x.message) }
    setBusy(false)
  }
  return (
    <div>
      <div className="flex items-center gap-3">
        {value && (/\.(mp4|webm)$/i.test(value) ? <video src={value} className="h-14 w-10 rounded object-cover" muted /> : <img src={value} alt="" className="h-14 w-14 rounded object-cover" />)}
        <label className="btn-outline cursor-pointer !py-2"><Upload size={16} />{busy ? 'Uploading…' : value ? 'Replace file' : 'Upload file'}<input type="file" accept={accept} className="sr-only" onChange={pick} disabled={busy} /></label>
      </div>
      <input className="field mt-2 text-xs" placeholder="…or paste a file URL" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      {err && <p role="alert" className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  )
}

export type F = { k: string; l: string; t: 'text' | 'textarea' | 'number' | 'bool' | 'date' | 'select' | 'lines' | 'file'; opts?: readonly string[]; accept?: string; kindField?: string; help?: string; req?: boolean }

export function Crud({ table, title, fields, blank, label, order = 'created_at', seed }: { table: string; title: string; fields: F[]; blank: Record<string, any>; label: (r: any) => string; order?: string; seed?: any[] }) {
  const { rows, err, loading, reload } = useRows(table)
  const [edit, setEdit] = useState<Record<string, any> | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const sorted = order === 'sort' ? [...rows].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : rows

  async function save() {
    if (!edit) return
    const missing = fields.find((f) => f.req && !String(edit[f.k] ?? '').trim())
    if (missing) return setMsg(`${missing.l} is required.`)
    setBusy(true); setMsg('')
    const { id, created_at, ...payload } = edit
    for (const f of fields) if (f.t === 'date' && !payload[f.k]) payload[f.k] = null
    const { error } = id ? await supabase.from(table).update(payload).eq('id', id) : await supabase.from(table).insert(payload)
    setBusy(false)
    if (error) return setMsg(error.message)
    setEdit(null); reload()
  }
  async function remove(id: string) { if (confirm('Delete this item permanently?')) { await supabase.from(table).delete().eq('id', id); reload() } }
  async function toggle(r: any) { await supabase.from(table).update({ published: !r.published }).eq('id', r.id); reload() }
  async function importDefaults() {
    setBusy(true)
    const { error } = await supabase.from(table).insert(seed!)
    setBusy(false); if (error) setMsg(error.message); else reload()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button className="btn-brand" onClick={() => { setMsg(''); setEdit({ ...blank }) }}><Plus size={16} />Add new</button>
      </div>
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      {!loading && !rows.length && seed && (
        <div className="mt-6 rounded-2xl border border-dashed border-navy-600/40 bg-white p-6">
          <p className="text-slate-600">Nothing is stored yet, so the public site shows the built-in content. Import it here to start editing it.</p>
          <button className="btn-navy mt-4" onClick={importDefaults} disabled={busy}>Import default content</button>
        </div>
      )}
      <ul className="mt-6 space-y-3">
        {sorted.map((r) => (
          <li key={r.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            {(r.poster_url || r.url || r.poster_url) && (/\.(mp4|webm)$/i.test(r.url ?? '') ? (r.poster_url && <img src={r.poster_url} alt="" className="h-14 w-10 rounded object-cover" />) : (r.url || r.poster_url) && <img src={r.url && r.kind !== 'video' ? r.url : r.poster_url} alt="" className="h-14 w-14 rounded object-cover" />)}
            <div className="min-w-0 flex-1"><p className="truncate font-semibold text-navy-800">{label(r)}</p><p className="text-xs text-slate-500">{r.published === false ? 'Unpublished (hidden from public)' : 'Published'}</p></div>
            {'published' in r && <button aria-label={r.published ? 'Unpublish' : 'Publish'} title={r.published ? 'Unpublish' : 'Publish'} className="p-2 text-slate-500 hover:text-navy-800" onClick={() => toggle(r)}>{r.published ? <Eye size={18} /> : <EyeOff size={18} />}</button>}
            <button aria-label="Edit" className="p-2 text-slate-500 hover:text-navy-800" onClick={() => { setMsg(''); setEdit(r) }}><Pencil size={18} /></button>
            <button aria-label="Delete" className="p-2 text-slate-400 hover:text-red-600" onClick={() => remove(r.id)}><Trash2 size={18} /></button>
          </li>
        ))}
      </ul>
      {edit && (
        <div role="dialog" aria-modal="true" aria-label={`${edit.id ? 'Edit' : 'Add'} ${title}`} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/70 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">{edit.id ? 'Edit' : 'Add'} item</h2><button aria-label="Close" onClick={() => setEdit(null)}><X /></button></div>
            <div className="mt-5 space-y-4">
              {fields.map((f) => {
                const id = `f-${f.k}`, v = edit[f.k]
                const set = (x: any) => setEdit((p) => ({ ...p!, [f.k]: x }))
                return (
                  <div key={f.k}>
                    {f.t !== 'bool' && <label htmlFor={id} className="label">{f.l}{f.req && <span className="text-red-600"> *</span>}</label>}
                    {f.t === 'text' && <input id={id} className="field" value={v ?? ''} onChange={(e) => set(e.target.value)} />}
                    {f.t === 'number' && <input id={id} type="number" className="field" value={v ?? 0} onChange={(e) => set(Number(e.target.value))} />}
                    {f.t === 'date' && <input id={id} type="date" className="field" value={v ?? ''} onChange={(e) => set(e.target.value)} />}
                    {f.t === 'textarea' && <textarea id={id} rows={4} className="field" value={v ?? ''} onChange={(e) => set(e.target.value)} />}
                    {f.t === 'select' && <select id={id} className="field" value={v ?? ''} onChange={(e) => set(e.target.value)}>{f.opts!.map((o) => <option key={o}>{o}</option>)}</select>}
                    {f.t === 'lines' && <textarea id={id} rows={5} className="field" value={(v ?? []).join('\n')} onChange={(e) => set(e.target.value.split('\n'))} onBlur={(e) => set(e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))} />}
                    {f.t === 'file' && <FileInput value={v} accept={f.accept ?? 'image/*'} folder={table} onChange={set} onKind={f.kindField ? (k) => setEdit((p) => ({ ...p!, [f.kindField!]: k })) : undefined} />}
                    {f.t === 'bool' && <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-4 w-4 accent-orange-500" checked={Boolean(v)} onChange={(e) => set(e.target.checked)} />{f.l}</label>}
                    {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
                  </div>
                )
              })}
            </div>
            {msg && <p role="alert" className="mt-4 text-sm text-red-600">{msg}</p>}
            <div className="mt-6 flex gap-3"><button className="btn-brand" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button><button className="btn-outline" onClick={() => setEdit(null)}>Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

const strip = ({ icon, ...r }: any) => r // "icon" is a front-end-only field in the default content

export const Programmes = () => <Crud table="programmes" title="Programmes" order="sort" label={(r) => r.title} seed={DEFAULT_PROGRAMMES.map(strip)}
  blank={{ slug: '', title: '', tagline: '', theme: '', summary: '', poster_url: '', hero_url: '', points: [], objectives: [], outcomes: [], published: true, sort: 10 }}
  fields={[{ k: 'title', l: 'Title', t: 'text', req: true }, { k: 'slug', l: 'URL slug', t: 'text', req: true, help: 'Lowercase with hyphens, e.g. champions-techno' }, { k: 'tagline', l: 'Tagline', t: 'text' }, { k: 'theme', l: 'Theme', t: 'text' }, { k: 'summary', l: 'Short description', t: 'textarea' },
    { k: 'poster_url', l: 'Programme poster', t: 'file' }, { k: 'hero_url', l: 'Programme video', t: 'file', accept: 'video/mp4,video/webm' },
    { k: 'points', l: 'What students learn (one per line)', t: 'lines' }, { k: 'objectives', l: 'Learning objectives (one per line)', t: 'lines' }, { k: 'outcomes', l: 'Expected outcomes (one per line)', t: 'lines' },
    { k: 'sort', l: 'Display order', t: 'number' }, { k: 'published', l: 'Published', t: 'bool' }]} />

export const Gallery = () => <Crud table="gallery_items" title="Gallery & videos" order="sort" label={(r) => `${r.title} (${r.category})`} seed={DEFAULT_GALLERY}
  blank={{ category: CATEGORIES[0], kind: 'image', title: '', url: '', poster_url: '', published: true, sort: 0 }}
  fields={[{ k: 'title', l: 'Title', t: 'text', req: true }, { k: 'category', l: 'Category', t: 'select', opts: CATEGORIES }, { k: 'url', l: 'Photo or video file', t: 'file', accept: 'image/*,video/mp4,video/webm', kindField: 'kind', req: true },
    { k: 'kind', l: 'Type', t: 'select', opts: ['image', 'video'] }, { k: 'poster_url', l: 'Video cover image (optional)', t: 'file' }, { k: 'sort', l: 'Display order', t: 'number' }, { k: 'published', l: 'Published', t: 'bool' }]} />

export const Announcements = () => <Crud table="announcements" title="Announcements" label={(r) => r.title}
  blank={{ title: '', body: '', published: true }}
  fields={[{ k: 'title', l: 'Headline (shown in the top banner)', t: 'text', req: true }, { k: 'body', l: 'Details', t: 'textarea' }, { k: 'published', l: 'Published', t: 'bool' }]} />

export const Jobs = () => <Crud table="jobs" title="Job openings" label={(r) => r.title}
  blank={{ title: '', department: '', job_type: '', location: '', description: '', requirements: '', last_date: null, published: true }}
  fields={[{ k: 'title', l: 'Job title', t: 'text', req: true }, { k: 'department', l: 'Department', t: 'text' }, { k: 'job_type', l: 'Type (e.g. Full-time)', t: 'text' }, { k: 'location', l: 'Location', t: 'text' }, { k: 'description', l: 'Description', t: 'textarea' }, { k: 'requirements', l: 'Requirements', t: 'textarea' }, { k: 'last_date', l: 'Last date to apply', t: 'date' }, { k: 'published', l: 'Published', t: 'bool' }]} />
