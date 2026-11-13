import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_SETTINGS } from '../lib/seed'
import { FileInput } from './Crud'

type Fd = { p: string; l: string; t: 'text' | 'textarea' | 'bool' | 'lines' | 'image' | 'pairs'; keys?: [string, string]; help?: string }
const SECTIONS: Record<string, Fd[]> = {
  'School': [{ p: 'school.name', l: 'School name', t: 'text' }, { p: 'school.city', l: 'Location', t: 'text' }, { p: 'school.tagline', l: 'Tagline', t: 'text' }, { p: 'school.welcome', l: 'Welcome text', t: 'textarea' }, { p: 'school.vision', l: 'Vision', t: 'textarea' }, { p: 'school.mission', l: 'Mission', t: 'textarea' }, { p: 'school.philosophy', l: 'Educational philosophy', t: 'textarea' }],
  'Chairman & CEO': ['chairman', 'ceo'].flatMap((w) => [
    { p: `leaders.${w}.name`, l: `${w === 'ceo' ? 'CEO' : 'Chairman'} name`, t: 'text' as const }, { p: `leaders.${w}.title`, l: 'Designation', t: 'text' as const },
    { p: `leaders.${w}.photo`, l: 'Photograph', t: 'image' as const }, { p: `leaders.${w}.message`, l: 'Message (one paragraph per line)', t: 'lines' as const }]),
  'Contact': [{ p: 'contact.address', l: 'Complete school address', t: 'textarea' }, { p: 'contact.phone', l: 'Telephone', t: 'text' }, { p: 'contact.email', l: 'Official email', t: 'text' }, { p: 'contact.whatsapp', l: 'WhatsApp number (with country code)', t: 'text' }, { p: 'contact.map_embed', l: 'Google Maps embed URL', t: 'text', help: 'Google Maps > Share > Embed a map > copy the src="…" link.' }, { p: 'contact.facebook', l: 'Facebook URL', t: 'text' }, { p: 'contact.instagram', l: 'Instagram URL', t: 'text' }, { p: 'contact.youtube', l: 'YouTube URL', t: 'text' }],
  'Admissions': [{ p: 'admissions.open', l: 'Admissions are open (shows the banner)', t: 'bool' }, { p: 'admissions.banner', l: 'Banner text', t: 'text' }, { p: 'admissions.academic_year', l: 'Academic year (e.g. 2027-28)', t: 'text' }, { p: 'admissions.classes', l: 'Classes accepting applications (one per line)', t: 'lines' }, { p: 'admissions.eligibility', l: 'Eligibility', t: 'textarea' }, { p: 'admissions.documents', l: 'Required documents (one per line)', t: 'lines' },
    { p: 'admissions.dates', l: 'Important dates (Label | Date)', t: 'pairs', keys: ['label', 'date'] }, { p: 'admissions.procedure', l: 'Procedure steps (Title | Description)', t: 'pairs', keys: ['t', 'd'] }, { p: 'admissions.faqs', l: 'FAQs (Question | Answer)', t: 'pairs', keys: ['q', 'a'] }],
  'Academics': [['classes', 'Classes offered'], ['curriculum', 'Curriculum details'], ['calendar', 'Academic calendar'], ['methodology', 'Teaching methodology'], ['assessment', 'Assessment and examinations'], ['activities', 'Academic activities'], ['homework', 'Homework and learning support'], ['parent_teacher', 'Parent-teacher communication'], ['achievements', 'Academic achievements']].map(([k, l]) => ({ p: `academics.${k}`, l, t: 'textarea' as const })),
  'Sports & facilities': [{ p: 'sports.categories', l: 'Sports categories (one per line)', t: 'lines' }, { p: 'sports.achievements', l: 'Sports achievements (one per line)', t: 'lines' }, { p: 'facilities', l: 'Additional facilities (Title | Description)', t: 'pairs', keys: ['title', 'text'] }],
}

const get = (o: any, p: string) => p.split('.').reduce((a, k) => a?.[k], o)
function put(o: any, p: string, v: any) {
  const ks = p.split('.'); const root = structuredClone(o); let c = root
  ks.slice(0, -1).forEach((k) => { c = c[k] }); c[ks[ks.length - 1]] = v; return root
}

export default function SettingsEditor() {
  const [s, setS] = useState<any>(DEFAULT_SETTINGS)
  const [tab, setTab] = useState('School')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      if (!data?.length) return
      setS((cur: any) => { let n = cur; data.forEach((r: any) => { n = { ...n, [r.key]: typeof r.value === 'object' && !Array.isArray(r.value) ? { ...n[r.key], ...r.value } : r.value } }); return n })
    })
  }, [])
  async function save() {
    setBusy(true); setMsg('')
    const rows = Object.keys(DEFAULT_SETTINGS).map((key) => ({ key, value: s[key], updated_at: new Date().toISOString() }))
    const { error } = await supabase.from('site_settings').upsert(rows)
    setBusy(false); setMsg(error ? error.message : 'Saved. The public website now shows these details.')
  }
  return (
    <div>
      <h1 className="text-3xl font-bold">School information</h1>
      <p className="mt-2 text-slate-600">Empty contact, admissions and academics fields stay hidden on the public site until you fill them in.</p>
      <div className="mt-5 flex flex-wrap gap-2">{Object.keys(SECTIONS).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-navy-800 text-white' : 'bg-white text-navy-800'}`}>{t}</button>)}</div>
      <div className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        {SECTIONS[tab].map((f) => {
          const v = get(s, f.p), set = (x: any) => setS((cur: any) => put(cur, f.p, x)), id = `s-${f.p}`
          return (
            <div key={f.p}>
              {f.t !== 'bool' && <label htmlFor={id} className="label">{f.l}</label>}
              {f.t === 'text' && <input id={id} className="field" value={v ?? ''} onChange={(e) => set(e.target.value)} />}
              {f.t === 'textarea' && <textarea id={id} rows={4} className="field" value={v ?? ''} onChange={(e) => set(e.target.value)} />}
              {f.t === 'bool' && <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-4 w-4 accent-orange-500" checked={Boolean(v)} onChange={(e) => set(e.target.checked)} />{f.l}</label>}
              {f.t === 'image' && <FileInput value={v} accept="image/*" folder="people" onChange={set} />}
              {f.t === 'lines' && <textarea id={id} rows={f.p.includes('message') ? 12 : 4} className="field" value={(v ?? []).join('\n')} onChange={(e) => set(e.target.value.split('\n'))} onBlur={(e) => set(e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))} />}
              {f.t === 'pairs' && <textarea id={id} rows={5} className="field" value={(v ?? []).map((o: any) => `${o[f.keys![0]]} | ${o[f.keys![1]]}`).join('\n')}
                onChange={(e) => set(e.target.value.split('\n').map((l) => { const [a, ...b] = l.split('|'); return { [f.keys![0]]: a.trim(), [f.keys![1]]: b.join('|').trim() } }))}
                onBlur={() => set((get(s, f.p) ?? []).filter((o: any) => o[f.keys![0]]))} />}
              {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
            </div>
          )
        })}
        {msg && <p role="status" className={`text-sm ${msg.startsWith('Saved') ? 'text-green-700' : 'text-red-600'}`}>{msg}</p>}
        <button className="btn-brand" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </div>
    </div>
  )
}
