import { useState, type FormEvent, type ReactNode } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useSettings } from '../lib/data'

function Field({ label, id, required, children }: { label: string; id: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && <span className="text-red-600"> *</span>}</label>
      {children}
    </div>
  )
}

const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
const phoneOk = (v: string) => /^[+()\-\s\d]{7,20}$/.test(v)

function useForm(submit: (d: FormData) => Promise<string>, validate: (d: Record<string, string>) => Record<string, string>) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [ref, setRef] = useState('')
  const [fail, setFail] = useState('')
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const plain: Record<string, string> = {}
    fd.forEach((v, k) => { if (typeof v === 'string') plain[k] = v.trim() })
    const errs = validate(plain)
    setErrors(errs); setFail('')
    if (Object.keys(errs).length) return
    if (!supabaseConfigured) { setFail('Online submission is not connected yet. Please contact the school office directly.'); return }
    setBusy(true)
    try { setRef(await submit(fd)); form.reset() } catch (err: any) { setFail(err?.message || 'Something went wrong. Please try again.') }
    setBusy(false)
  }
  return { errors, busy, ref, fail, onSubmit }
}

function Done({ ref_, what }: { ref_: string; what: string }) {
  return (
    <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
      <CheckCircle2 className="mx-auto text-green-600" size={44} />
      <h3 className="mt-3 text-2xl font-bold">{what} received</h3>
      <p className="mt-2 text-slate-600">Your reference number is</p>
      <p className="mt-1 font-mono text-2xl font-bold text-navy-800">{ref_}</p>
      <p className="mt-3 text-sm text-slate-500">Please keep this number for future communication with the school.</p>
    </div>
  )
}

const Err = ({ m }: { m?: string }) => (m ? <p role="alert" className="mt-1 text-xs text-red-600">{m}</p> : null)
const Submit = ({ busy, children }: { busy: boolean; children: ReactNode }) => (
  <button className="btn-brand w-full sm:w-auto" disabled={busy}>{busy && <Loader2 className="animate-spin" size={16} />}{children}</button>
)

export function EnquiryForm() {
  const { data: s } = useSettings()
  const y = new Date().getFullYear()
  const years = s.admissions.academic_year ? [s.admissions.academic_year] : [`${y}-${String(y + 1).slice(2)}`, `${y + 1}-${String(y + 2).slice(2)}`]
  const f = useForm(
    async (d) => {
      const { data, error } = await supabase.rpc('submit_enquiry', {
        p_parent: d.get('parent'), p_student: d.get('student'), p_phone: d.get('phone'), p_email: d.get('email'),
        p_class: d.get('cls'), p_year: d.get('year'), p_message: d.get('message') || null,
      })
      if (error) throw new Error('Could not submit your enquiry. Please check the details and try again.')
      return data as string
    },
    (d) => {
      const e: Record<string, string> = {}
      if (!d.parent) e.parent = 'Enter the parent or guardian name'
      if (!d.student) e.student = 'Enter the student name'
      if (!phoneOk(d.phone || '')) e.phone = 'Enter a valid contact number'
      if (!emailOk(d.email || '')) e.email = 'Enter a valid email address'
      if (!d.cls) e.cls = 'Select or enter the class'
      if (!d.year) e.year = 'Select the academic year'
      return e
    },
  )
  if (f.ref) return <Done ref_={f.ref} what="Admission enquiry" />
  return (
    <form onSubmit={f.onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Parent / Guardian name" id="parent" required><input id="parent" name="parent" className="field" autoComplete="name" /><Err m={f.errors.parent} /></Field>
      <Field label="Student name" id="student" required><input id="student" name="student" className="field" /><Err m={f.errors.student} /></Field>
      <Field label="Contact number" id="phone" required><input id="phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" /><Err m={f.errors.phone} /></Field>
      <Field label="Email address" id="email" required><input id="email" name="email" type="email" className="field" autoComplete="email" /><Err m={f.errors.email} /></Field>
      <Field label="Class applying for" id="cls" required>
        {s.admissions.classes.length ? (
          <select id="cls" name="cls" className="field" defaultValue=""><option value="" disabled>Select class</option>{s.admissions.classes.map((c) => <option key={c}>{c}</option>)}</select>
        ) : <input id="cls" name="cls" className="field" placeholder="e.g. Class 1" />}
        <Err m={f.errors.cls} />
      </Field>
      <Field label="Academic year" id="year" required>
        <select id="year" name="year" className="field" defaultValue={years[0]}>{years.map((a) => <option key={a}>{a}</option>)}</select><Err m={f.errors.year} />
      </Field>
      <div className="sm:col-span-2"><Field label="Message" id="message"><textarea id="message" name="message" rows={4} className="field" maxLength={2000} /></Field></div>
      <div className="sm:col-span-2">
        {f.fail && <p role="alert" className="mb-3 text-sm text-red-600">{f.fail}</p>}
        <Submit busy={f.busy}>Submit enquiry</Submit>
        <p className="mt-3 text-xs text-slate-500">Please do not share bank card details or other payment information in this form.</p>
      </div>
    </form>
  )
}

export function ContactForm() {
  const f = useForm(
    async (d) => {
      const { data, error } = await supabase.rpc('submit_contact', { p_name: d.get('name'), p_email: d.get('email') || null, p_phone: d.get('phone') || null, p_message: d.get('message') })
      if (error) throw new Error('Could not send your message. Please check the details and try again.')
      return data as string
    },
    (d) => {
      const e: Record<string, string> = {}
      if (!d.name) e.name = 'Enter your name'
      if (!d.email && !d.phone) e.email = 'Enter an email or phone number'
      if (d.email && !emailOk(d.email)) e.email = 'Enter a valid email address'
      if (d.phone && !phoneOk(d.phone)) e.phone = 'Enter a valid phone number'
      if (!d.message) e.message = 'Write your message'
      return e
    },
  )
  if (f.ref) return <Done ref_={f.ref} what="Message" />
  return (
    <form onSubmit={f.onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" id="c-name" required><input id="c-name" name="name" className="field" /><Err m={f.errors.name} /></Field>
      <Field label="Email address" id="c-email"><input id="c-email" name="email" type="email" className="field" /><Err m={f.errors.email} /></Field>
      <Field label="Phone number" id="c-phone"><input id="c-phone" name="phone" type="tel" className="field" /><Err m={f.errors.phone} /></Field>
      <div className="sm:col-span-2"><Field label="Message" id="c-msg" required><textarea id="c-msg" name="message" rows={5} className="field" maxLength={2000} /><Err m={f.errors.message} /></Field></div>
      <div className="sm:col-span-2">{f.fail && <p role="alert" className="mb-3 text-sm text-red-600">{f.fail}</p>}<Submit busy={f.busy}>Send message</Submit></div>
    </form>
  )
}

export function ApplyForm({ jobId, jobTitle }: { jobId?: string; jobTitle?: string }) {
  const f = useForm(
    async (d) => {
      let path: string | null = null
      const file = d.get('resume') as File | null
      if (file && file.size) {
        path = `${crypto.randomUUID()}/${file.name.replace(/[^\w.\-]/g, '_')}`
        const up = await supabase.storage.from('resumes').upload(path, file, { contentType: file.type })
        if (up.error) throw new Error('Resume upload failed. Use a PDF or Word file under 5 MB.')
      }
      const { data, error } = await supabase.rpc('submit_application', {
        p_job: jobId ?? null, p_name: d.get('name'), p_email: d.get('email'), p_phone: d.get('phone'),
        p_qualification: d.get('qualification') || null, p_experience: d.get('experience') || null, p_message: d.get('message') || null, p_resume: path,
      })
      if (error) throw new Error('Could not submit your application. Please check the details and try again.')
      return data as string
    },
    (d) => {
      const e: Record<string, string> = {}
      if (!d.name) e.name = 'Enter your full name'
      if (!emailOk(d.email || '')) e.email = 'Enter a valid email address'
      if (!phoneOk(d.phone || '')) e.phone = 'Enter a valid phone number'
      return e
    },
  )
  if (f.ref) return <Done ref_={f.ref} what="Application" />
  return (
    <form onSubmit={f.onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <p className="sm:col-span-2 text-sm text-slate-600">Applying for: <strong className="text-navy-800">{jobTitle || 'General application'}</strong></p>
      <Field label="Full name" id="a-name" required><input id="a-name" name="name" className="field" /><Err m={f.errors.name} /></Field>
      <Field label="Email address" id="a-email" required><input id="a-email" name="email" type="email" className="field" /><Err m={f.errors.email} /></Field>
      <Field label="Phone number" id="a-phone" required><input id="a-phone" name="phone" type="tel" className="field" /><Err m={f.errors.phone} /></Field>
      <Field label="Highest qualification" id="a-q"><input id="a-q" name="qualification" className="field" /></Field>
      <Field label="Experience" id="a-x"><input id="a-x" name="experience" className="field" placeholder="e.g. 3 years teaching" /></Field>
      <Field label="Resume (PDF or Word, max 5 MB)" id="a-r"><input id="a-r" name="resume" type="file" accept=".pdf,.doc,.docx" className="field file:mr-3 file:rounded file:border-0 file:bg-navy-50 file:px-3 file:py-1" /></Field>
      <div className="sm:col-span-2"><Field label="Message" id="a-m"><textarea id="a-m" name="message" rows={4} className="field" maxLength={2000} /></Field></div>
      <div className="sm:col-span-2">{f.fail && <p role="alert" className="mb-3 text-sm text-red-600">{f.fail}</p>}<Submit busy={f.busy}>Submit application</Submit></div>
    </form>
  )
}
