import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ChevronDown, Clock, Facebook, FileText, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react'
import { useJobs, useSettings } from '../lib/data'
import { Heading, PageHeader, Pending, useSeo } from '../components/ui'
import { ApplyForm, ContactForm, EnquiryForm } from '../components/Forms'

export function Admissions() {
  const { data: s } = useSettings()
  const a = s.admissions
  useSeo('Admissions', 'Admission enquiry, procedure and requirements at The Champions Matriculation Hr. Sec. School, Madurai.')
  return (
    <>
      <PageHeader title="Admissions" sub="Every Champion Starts Somewhere. Tell us about your child." image="/media/img/campus-front.webp" />
      <section className="section"><div className="wrap">
        {a.open && <div className="mb-10 rounded-2xl bg-brand-light p-6 text-center"><p className="font-display text-2xl font-bold text-navy-800">{a.banner}{a.academic_year ? ` for ${a.academic_year}` : ''}</p></div>}
        <Heading title="Admission procedure" />
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {a.procedure.map((p, i) => <li key={p.t} className="rounded-2xl border border-slate-200 p-6"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 font-bold text-white">{i + 1}</span><h3 className="mt-4 font-sans text-lg font-bold">{p.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{p.d}</p></li>)}
        </ol>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <div><h3 className="text-2xl font-bold">Eligibility</h3>{a.eligibility ? <p className="mt-3 whitespace-pre-line text-slate-600">{a.eligibility}</p> : <div className="mt-3"><Pending>Eligibility details will be published here once verified by the school. Please ask the school office.</Pending></div>}</div>
          <div><h3 className="text-2xl font-bold">Required documents</h3>{a.documents.length ? <ul className="mt-3 space-y-2 text-slate-600">{a.documents.map((d) => <li key={d} className="flex gap-2"><FileText size={18} className="mt-0.5 shrink-0 text-brand" />{d}</li>)}</ul> : <div className="mt-3"><Pending>The document list will be shared by the school office.</Pending></div>}</div>
          <div><h3 className="text-2xl font-bold">Important dates</h3>{a.dates.length ? <ul className="mt-3 space-y-2 text-slate-600">{a.dates.map((d) => <li key={d.label} className="flex gap-2"><Clock size={18} className="mt-0.5 shrink-0 text-brand" /><span><strong className="text-navy-800">{d.label}</strong>: {d.date}</span></li>)}</ul> : <div className="mt-3"><Pending>Dates will be announced here.</Pending></div>}</div>
        </div>
      </div></section>
      {a.faqs.length > 0 && <section className="section bg-ash"><div className="wrap max-w-3xl"><Heading title="Frequently asked questions" />
        <div className="mt-8 space-y-3">{a.faqs.map((f) => <details key={f.q} className="group rounded-xl bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy-800">{f.q}<ChevronDown className="transition group-open:rotate-180" size={18} /></summary><p className="mt-3 text-slate-600">{f.a}</p></details>)}</div></div></section>}
      <section id="enquiry" className="section scroll-mt-16 bg-ash"><div className="wrap max-w-3xl">
        <Heading title="Admission enquiry" sub="Submit your details and you will receive a reference number instantly." />
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8"><EnquiryForm /></div>
      </div></section>
    </>
  )
}

export function Careers() {
  const { data: jobs, loading } = useJobs()
  const [sel, setSel] = useState<{ id?: string; title?: string } | null>(null)
  useSeo('Careers', 'Teaching and staff openings at The Champions Matriculation Hr. Sec. School, Madurai. Apply online.')
  return (
    <>
      <PageHeader title="Careers at Champions" sub="Join a team that helps every child discover their potential." image="/media/img/corridor-1.webp" />
      <section className="section"><div className="wrap">
        <Heading title="Current openings" sub="Educators and staff who share our belief in academics, character and practical learning are welcome." />
        {!loading && jobs.length === 0 && <div className="mt-8"><Pending>There are no advertised openings right now. You can still send a general application and we will keep it on record.</Pending></div>}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {jobs.map((j) => (
            <article key={j.id} className="rounded-2xl border border-slate-200 p-6">
              <Briefcase className="text-brand" size={24} />
              <h3 className="mt-2 text-xl font-bold">{j.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{[j.department, j.job_type, j.location].filter(Boolean).join(' • ')}</p>
              {j.description && <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{j.description}</p>}
              {j.requirements && <p className="mt-3 whitespace-pre-line text-sm text-slate-600"><strong className="text-navy-800">Requirements: </strong>{j.requirements}</p>}
              {j.last_date && <p className="mt-3 text-sm font-medium text-brand-dark">Apply by {new Date(j.last_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
              <button className="btn-navy mt-5" onClick={() => { setSel({ id: j.id, title: j.title }); setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>Apply for this role</button>
            </article>
          ))}
        </div>
      </div></section>
      <section id="apply" className="section scroll-mt-16 bg-ash"><div className="wrap max-w-3xl">
        <Heading title="Apply online" />
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8"><ApplyForm key={sel?.id ?? 'general'} jobId={sel?.id} jobTitle={sel?.title} /></div>
        {sel && <button className="mt-3 text-sm font-semibold text-navy-700 underline" onClick={() => setSel(null)}>Switch to a general application</button>}
      </div></section>
    </>
  )
}

export function Contact() {
  const { data: s } = useSettings()
  const c = s.contact
  useSeo('Contact Us', 'Contact The Champions Matriculation Hr. Sec. School, Madurai.')
  const rows = [
    c.address && { I: MapPin, t: 'Address', v: c.address },
    c.phone && { I: Phone, t: 'Telephone', v: c.phone, h: `tel:${c.phone}` },
    c.email && { I: Mail, t: 'Email', v: c.email, h: `mailto:${c.email}` },
    c.whatsapp && { I: MessageCircle, t: 'WhatsApp', v: c.whatsapp, h: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}` },
  ].filter(Boolean) as { I: any; t: string; v: string; h?: string }[]
  const social = [[c.facebook, Facebook, 'Facebook'], [c.instagram, Instagram, 'Instagram'], [c.youtube, Youtube, 'YouTube']].filter(([u]) => u) as [string, any, string][]
  return (
    <>
      <PageHeader title="Contact Us" sub="We would love to hear from you." image="/media/img/campus-building.webp" />
      <section className="section"><div className="wrap grid gap-10 lg:grid-cols-2">
        <div>
          <Heading title="Get in touch" />
          {rows.length ? <ul className="mt-8 space-y-5">{rows.map(({ I, t, v, h }) => <li key={t} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700"><I size={20} /></span><div><p className="text-sm font-semibold text-slate-500">{t}</p>{h ? <a href={h} className="font-medium text-navy-800 hover:text-brand-dark" target={h.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{v}</a> : <p className="font-medium text-navy-800">{v}</p>}</div></li>)}</ul>
            : <div className="mt-8"><Pending>Official school address, phone and email will appear here once verified. In the meantime, send us a message or <Link className="font-semibold underline" to="/admissions#enquiry">submit an admission enquiry</Link>.</Pending></div>}
          {social.length > 0 && <div className="mt-8 flex gap-3">{social.map(([u, I, n]) => <a key={n} href={u} aria-label={n} target="_blank" rel="noreferrer" className="rounded-full bg-navy-800 p-3 text-white hover:bg-brand"><I size={18} /></a>)}</div>}
          {c.map_embed && <iframe title="School location on Google Maps" src={c.map_embed} loading="lazy" className="mt-8 h-72 w-full rounded-2xl border-0" referrerPolicy="no-referrer-when-downgrade" />}
        </div>
        <div className="rounded-2xl bg-ash p-6 sm:p-8"><h2 className="mb-6 text-2xl font-bold">Send us a message</h2><ContactForm /></div>
      </div></section>
    </>
  )
}
