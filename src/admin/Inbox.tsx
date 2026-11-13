import { Fragment, useCallback, useEffect, useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toCsv } from '../components/ui'
import { useRole } from './Auth'
import type { Status } from '../lib/types'

type Row = Record<string, any> & { id: string; status: Status; created_at: string }
const STATUSES: Status[] = ['new', 'pending', 'completed']
export const badge = (s: string) => ({ new: 'bg-orange-100 text-orange-800', pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800' } as Record<string, string>)[s] ?? ''

export function useRows(table: string) {
  const [rows, setRows] = useState<Row[]>([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    if (error) setErr(error.message); else setRows((data ?? []) as Row[])
    setLoading(false)
  }, [table])
  useEffect(() => { load() }, [load])
  return { rows, err, loading, reload: load }
}

export function Inbox({ table, title, columns, detail, exportName }: { table: string; title: string; columns: [string, string][]; detail: [string, string][]; exportName: string }) {
  const { rows, err, loading, reload } = useRows(table)
  const role = useRole()
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [open, setOpen] = useState<string | null>(null)
  const shown = rows.filter((r) => filter === 'all' || r.status === filter)

  async function setStatus(id: string, status: Status) { await supabase.from(table).update({ status }).eq('id', id); reload() }
  async function remove(id: string) { if (confirm('Delete this record permanently?')) { await supabase.from(table).delete().eq('id', id); reload() } }
  function exportCsv() {
    const csv = toCsv(shown.map(({ id, ...r }) => r))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${exportName}-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }
  async function resume(path: string) {
    const { data } = await supabase.storage.from('resumes').createSignedUrl(path, 120)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button className="btn-navy" onClick={exportCsv} disabled={!shown.length}><Download size={16} />Export CSV</button>
      </div>
      <div className="mt-5 flex gap-2">{(['all', ...STATUSES] as const).map((s) => <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${filter === s ? 'bg-navy-800 text-white' : 'bg-white text-navy-800'}`}>{s} {s === 'all' ? rows.length : rows.filter((r) => r.status === s).length}</button>)}</div>
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-navy-50 text-navy-800"><tr>{columns.map(([, h]) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}<th className="px-4 py-3 font-semibold">Status</th><th /></tr></thead>
          <tbody>
            {loading && <tr><td className="p-6 text-slate-500" colSpan={9}>Loading…</td></tr>}
            {!loading && !shown.length && <tr><td className="p-6 text-slate-500" colSpan={9}>Nothing here yet.</td></tr>}
            {shown.map((r) => (
              <Fragment key={r.id}>
                <tr className="cursor-pointer border-b last:border-0 hover:bg-ash" onClick={() => setOpen(open === r.id ? null : r.id)}>
                  {columns.map(([k]) => <td key={k} className="px-4 py-3">{k === 'created_at' ? new Date(r[k]).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : String(r[k] ?? '')}</td>)}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select aria-label="Status" value={r.status} onChange={(e) => setStatus(r.id, e.target.value as Status)} className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge(r.status)}`}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                  </td>
                  <td className="px-2" onClick={(e) => e.stopPropagation()}>{role === 'admin' && <button aria-label="Delete" className="p-2 text-slate-400 hover:text-red-600" onClick={() => remove(r.id)}><Trash2 size={16} /></button>}</td>
                </tr>
                {open === r.id && (
                  <tr className="border-b bg-ash"><td colSpan={9} className="px-4 py-4">
                    <dl className="grid gap-3 sm:grid-cols-2">{detail.filter(([k]) => r[k]).map(([k, l]) => <div key={k}><dt className="text-xs font-semibold text-slate-500">{l}</dt><dd className="whitespace-pre-line">{r[k]}</dd></div>)}</dl>
                    {r.resume_path && <button className="btn-outline mt-4 !py-2" onClick={() => resume(r.resume_path)}>Open resume</button>}
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const Enquiries = () => <Inbox table="enquiries" title="Admission enquiries" exportName="admission-enquiries"
  columns={[['ref', 'Reference'], ['student_name', 'Student'], ['parent_name', 'Parent'], ['phone', 'Phone'], ['class_applying', 'Class'], ['created_at', 'Received']]}
  detail={[['email', 'Email'], ['academic_year', 'Academic year'], ['message', 'Message']]} />
export const Applications = () => <Inbox table="job_applications" title="Career applications" exportName="career-applications"
  columns={[['ref', 'Reference'], ['name', 'Applicant'], ['job_title', 'Role'], ['phone', 'Phone'], ['created_at', 'Received']]}
  detail={[['email', 'Email'], ['qualification', 'Qualification'], ['experience', 'Experience'], ['message', 'Message']]} />
export const Messages = () => <Inbox table="contact_messages" title="Contact messages" exportName="contact-messages"
  columns={[['ref', 'Reference'], ['name', 'Name'], ['phone', 'Phone'], ['email', 'Email'], ['created_at', 'Received']]}
  detail={[['message', 'Message']]} />
