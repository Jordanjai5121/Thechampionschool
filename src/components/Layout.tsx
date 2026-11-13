import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronDown, Facebook, Instagram, Mail, MapPin, Menu, Phone, X, Youtube } from 'lucide-react'
import { useProgrammes, useSettings, useAnnouncements } from '../lib/data'

const links = [
  { to: '/', label: 'Home' }, { to: '/about', label: 'About Us' }, { to: '/academics', label: 'Academics' },
  { to: '/programmes', label: 'Our Programmes', menu: true }, { to: '/sports', label: 'Sports & Activities' },
  { to: '/campus', label: 'Campus & Facilities' }, { to: '/gallery', label: 'Gallery' },
  { to: '/admissions', label: 'Admissions' }, { to: '/careers', label: 'Careers' }, { to: '/contact', label: 'Contact Us' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [sub, setSub] = useState(false)
  const { data: progs } = useProgrammes()
  const { data: s } = useSettings()
  const { data: news } = useAnnouncements()
  const { pathname } = useLocation()
  const close = () => { setOpen(false); setSub(false) }
  const nav = 'whitespace-nowrap px-2 py-2 text-[13px] font-medium text-white/85 hover:text-white transition'
  const active = ({ isActive }: { isActive: boolean }) => `${nav} ${isActive ? '!text-brand' : ''}`

  return (
    <div className="flex min-h-screen flex-col">
      {(s.admissions.open || news[0]) && (
        <div className="bg-brand text-white">
          <div className="wrap flex items-center justify-center gap-3 py-2 text-center text-sm font-medium">
            <span>{news[0] ? news[0].title : `${s.admissions.banner}${s.admissions.academic_year ? ` for ${s.admissions.academic_year}` : ''}`}</span>
            {s.admissions.open && <Link to="/admissions#enquiry" className="underline underline-offset-2">Enquire now</Link>}
          </div>
        </div>
      )}
      <nav className="sticky top-0 z-40 bg-navy-800 shadow-md">
        <div className="wrap flex items-center justify-between gap-3 py-2.5">
          <Link to="/" onClick={close} aria-label="The Champions Matriculation Hr. Sec. School, home">
            <img src="/media/img/logo.webp" alt="The Champions Matriculation Hr. Sec. School, Madurai" className="h-10 w-auto rounded sm:h-11" width={648} height={181} />
          </Link>
          <div className="hidden items-center xl:flex">
            {links.map((l) =>
              l.menu ? (
                <div key={l.to} className="group relative">
                  <NavLink to={l.to} className={(a) => `${active(a)} inline-flex items-center gap-1`}>{l.label}<ChevronDown size={14} /></NavLink>
                  <div className="invisible absolute left-0 top-full w-60 rounded-xl bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {progs.map((p) => (
                      <Link key={p.slug} to={`/programmes/${p.slug}`} className="block rounded-lg px-3 py-2 text-sm text-navy-800 hover:bg-navy-50">{p.title}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} className={active}>{l.label}</NavLink>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admissions#enquiry" className="btn-brand hidden whitespace-nowrap !px-4 !py-2.5 sm:inline-flex">Apply for Admission</Link>
            <button className="rounded-lg p-2 text-white xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-white/10 bg-navy-900 xl:hidden">
            <div className="wrap flex flex-col py-3">
              {links.map((l) => (
                <div key={l.to}>
                  <div className="flex items-center justify-between">
                    <NavLink to={l.to} end={l.to === '/'} onClick={close} className={({ isActive }) => `block flex-1 py-3 text-base font-medium ${isActive ? 'text-brand' : 'text-white'}`}>{l.label}</NavLink>
                    {l.menu && <button className="p-3 text-white" aria-label="Toggle programmes" onClick={() => setSub(!sub)}><ChevronDown className={sub ? 'rotate-180' : ''} size={18} /></button>}
                  </div>
                  {l.menu && sub && progs.map((p) => (
                    <Link key={p.slug} to={`/programmes/${p.slug}`} onClick={close} className="block py-2 pl-4 text-sm text-white/75">{p.title}</Link>
                  ))}
                </div>
              ))}
              <Link to="/admissions#enquiry" onClick={close} className="btn-brand mt-3">Apply for Admission</Link>
            </div>
          </div>
        )}
      </nav>
      <main key={pathname} className="flex-1"><Outlet /></main>
      <footer className="bg-navy-900 text-white/75">
        <div className="wrap grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src="/media/img/logo.webp" alt={s.school.name} className="h-14 w-auto rounded" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{s.school.tagline}</p>
            <div className="mt-5 flex gap-3">
              {s.contact.facebook && <a href={s.contact.facebook} aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-brand" target="_blank" rel="noreferrer"><Facebook size={18} /></a>}
              {s.contact.instagram && <a href={s.contact.instagram} aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-brand" target="_blank" rel="noreferrer"><Instagram size={18} /></a>}
              {s.contact.youtube && <a href={s.contact.youtube} aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-brand" target="_blank" rel="noreferrer"><Youtube size={18} /></a>}
            </div>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold !text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {links.slice(0, 7).map((l) => <li key={l.to}><Link className="hover:text-brand" to={l.to}>{l.label}</Link></li>)}
              <li><Link className="hover:text-brand" to="/admissions">Admissions</Link></li>
              <li><Link className="hover:text-brand" to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold !text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-brand" />{s.contact.address || s.school.city}</li>
              {s.contact.phone && <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-brand" /><a href={`tel:${s.contact.phone}`}>{s.contact.phone}</a></li>}
              {s.contact.email && <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-brand" /><a href={`mailto:${s.contact.email}`}>{s.contact.email}</a></li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs">
          © {new Date().getFullYear()} {s.school.name}. All rights reserved. <Link to="/admin" className="ml-2 hover:text-brand">Staff login</Link>
        </div>
      </footer>
    </div>
  )
}
