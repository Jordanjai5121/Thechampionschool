import { Link } from 'react-router-dom'
import { useRows, badge } from './Inbox'

export default function Dashboard() {
  const { rows: enq } = useRows('enquiries')
  const { rows: apps } = useRows('job_applications')
  const { rows: msgs } = useRows('contact_messages')
  const c = (s: string) => enq.filter((r) => r.status === s).length
  const cards = [['Total enquiries', enq.length], ['New', c('new')], ['Pending', c('pending')], ['Completed', c('completed')], ['New career applications', apps.filter((r) => r.status === 'new').length], ['New messages', msgs.filter((r) => r.status === 'new').length]]
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">{cards.map(([l, n]) => <div key={l} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{l}</p><p className="mt-1 font-display text-4xl font-bold text-navy-800">{n}</p></div>)}</div>
      <div className="mt-10 flex items-center justify-between"><h2 className="text-2xl font-bold">Recent enquiries</h2><Link to="/admin/enquiries" className="text-sm font-semibold text-navy-700 underline">View all</Link></div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm"><tbody>
          {enq.slice(0, 6).map((r) => <tr key={r.id} className="border-b last:border-0"><td className="px-4 py-3 font-mono text-xs">{r.ref}</td><td className="px-4 py-3">{r.student_name}</td><td className="px-4 py-3">{r.parent_name}</td><td className="px-4 py-3">{r.class_applying}</td><td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge(r.status)}`}>{r.status}</span></td></tr>)}
          {!enq.length && <tr><td className="p-6 text-slate-500">No enquiries yet.</td></tr>}
        </tbody></table>
      </div>
    </div>
  )
}
