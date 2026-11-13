import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Briefcase, ExternalLink, FolderOpen, Image, LayoutDashboard, LogOut, Mail, Megaphone, Settings, Users, Layers, Menu, X } from 'lucide-react'
import { supabase, supabaseConfigured } from '../lib/supabase'

type Role = 'admin' | 'editor'
export const RoleCtx = createContext<Role>('editor')
export const useRole = () => useContext(RoleCtx)

function Login({ note }: { note?: string }) {
  const [err, setErr] = useState(note ?? '')
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr('')
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.auth.signInWithPassword({ email: String(fd.get('email')), password: String(fd.get('password')) })
    if (error) setErr('Incorrect email or password.')
    setBusy(false)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <img src="/media/img/logo.webp" alt="The Champions" className="mb-6 h-14 w-auto rounded" />
        <h1 className="text-2xl font-bold">Staff sign in</h1>
        {!supabaseConfigured && <p className="mt-3 rounded-lg bg-brand-light p-3 text-sm">Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (see README).</p>}
        <label htmlFor="email" className="label mt-5">Email</label><input id="email" name="email" type="email" required className="field" autoComplete="username" />
        <label htmlFor="password" className="label mt-4">Password</label><input id="password" name="password" type="password" required className="field" autoComplete="current-password" />
        {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
        <button className="btn-brand mt-6 w-full" disabled={busy || !supabaseConfigured}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-navy-700">Back to website</Link>
      </form>
    </div>
  )
}

const nav = [
  ['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/enquiries', 'Admission enquiries', Users], ['/admin/applications', 'Career applications', Briefcase],
  ['/admin/messages', 'Contact messages', Mail], ['/admin/programmes', 'Programmes', Layers], ['/admin/gallery', 'Gallery & videos', Image],
  ['/admin/announcements', 'Announcements', Megaphone], ['/admin/jobs', 'Job openings', FolderOpen], ['/admin/settings', 'School information', Settings],
] as const

export function AdminShell(): ReactNode {
  const [state, setState] = useState<'loading' | 'out' | 'denied' | { role: Role }>('loading')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!supabaseConfigured) { setState('out'); return }
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return setState('out')
      const { data: p } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).maybeSingle()
      setState(p?.role ? { role: p.role as Role } : 'denied')
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange(() => { check() })
    return () => sub.subscription.unsubscribe()
  }, [])
  if (state === 'loading') return <div className="p-10 text-center text-slate-500">Loading…</div>
  if (state === 'out') return <Login />
  if (state === 'denied') return <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"><h1 className="text-2xl font-bold">No admin access</h1><p className="text-slate-600">This account is not registered as school staff. Ask an administrator to add you.</p><button className="btn-navy" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
  const link = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-white/80 hover:bg-white/10'}`
  return (
    <RoleCtx.Provider value={state.role}>
      <div className="flex min-h-screen bg-ash">
        <aside className={`${open ? 'fixed inset-0 z-40 block' : 'hidden'} w-64 shrink-0 bg-navy-900 p-4 lg:static lg:block`}>
          <div className="mb-6 flex items-center justify-between"><img src="/media/img/logo.webp" alt="The Champions" className="h-11 w-auto rounded" /><button className="text-white lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
          <nav className="space-y-1">{nav.map(([to, label, I, end]) => <NavLink key={to} to={to} end={Boolean(end)} className={link} onClick={() => setOpen(false)}><I size={18} />{label}</NavLink>)}</nav>
          <div className="mt-8 space-y-1 border-t border-white/10 pt-4">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white"><ExternalLink size={16} />View website</a>
            <button onClick={() => supabase.auth.signOut()} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white"><LogOut size={16} />Sign out ({state.role})</button>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm lg:hidden"><button aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button><span className="font-semibold text-navy-800">Admin</span></div>
          <main className="mx-auto max-w-6xl p-4 sm:p-8"><Outlet /></main>
        </div>
      </div>
    </RoleCtx.Provider>
  )
}
