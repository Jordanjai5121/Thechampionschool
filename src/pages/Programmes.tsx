import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Target, Sparkles } from 'lucide-react'
import { useProgrammes } from '../lib/data'
import { CtaBand, Heading, ICONS, PageHeader, useSeo } from '../components/ui'
import { VideoTile } from '../components/Media'
import NotFound from './NotFound'

export function Programmes() {
  const { data: progs } = useProgrammes()
  useSeo('Our Programmes', 'Six signature programmes: Champions Techno, Life Skills, Think, Voice, Career and Emote.')
  return (
    <>
      <PageHeader title="Our six signature programmes" sub="Technology, life skills, thinking, communication, careers and emotional intelligence, taught beside the regular syllabus." image="/media/img/campus-building.webp" />
      <section className="section"><div className="wrap space-y-10">
        {progs.map((p, i) => {
          const Icon = ICONS[p.icon ?? 'lightbulb']
          return (
            <article key={p.slug} className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <img src={p.poster_url} alt={`${p.title} poster`} loading="lazy" className="max-h-[520px] w-full rounded-2xl object-cover object-top shadow-lg" />
              <div>
                {Icon && <Icon className="text-brand" size={28} />}
                <h2 className="mt-2 text-3xl font-bold">{p.title}</h2>
                <p className="mt-1 font-semibold text-brand-dark">{p.tagline}</p>
                <p className="mt-4 text-slate-600">{p.summary}</p>
                <Link to={`/programmes/${p.slug}`} className="btn-navy mt-6">Learn more <ArrowRight size={16} /></Link>
              </div>
            </article>
          )
        })}
      </div></section>
      <CtaBand />
    </>
  )
}

export function ProgrammeDetail() {
  const { slug } = useParams()
  const { data: progs, loading } = useProgrammes()
  const p = progs.find((x) => x.slug === slug)
  useSeo(p?.title ?? 'Programme', p?.summary ?? 'Champions programme')
  if (!p) return loading ? null : <NotFound />
  const Icon = ICONS[p.icon ?? 'lightbulb']
  const others = progs.filter((x) => x.slug !== p.slug)
  return (
    <>
      <PageHeader title={p.title} sub={p.theme} image={p.poster_url} />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="font-display text-2xl font-bold text-brand-dark">{p.tagline}</p>
            <p className="lead">{p.summary}</p>
            <h2 className="mt-10 text-2xl font-bold">What students learn</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 rounded-xl bg-ash p-4 text-sm font-medium text-navy-800">
                  {Icon && <Icon className="mt-0.5 shrink-0 text-brand" size={18} />}{pt}
                </li>
              ))}
            </ul>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div><h3 className="flex items-center gap-2 text-xl font-bold"><Target className="text-brand" size={20} />Learning objectives</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">{p.objectives.map((o) => <li key={o} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-navy-600" />{o}</li>)}</ul></div>
              <div><h3 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="text-brand" size={20} />Expected outcomes</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">{p.outcomes.map((o) => <li key={o} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-navy-600" />{o}</li>)}</ul></div>
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-2">
            <img src={p.poster_url} alt={`${p.title} poster`} className="w-full rounded-2xl shadow-lg" />
            {p.hero_url && <VideoTile src={p.hero_url} title={`${p.title} in action`} className="aspect-[9/14] max-w-xs" />}
          </aside>
        </div>
      </section>
      <section className="section bg-ash"><div className="wrap">
        <Heading title="Explore other programmes" />
        <div className="mt-8 flex flex-wrap gap-3">{others.map((o) => <Link key={o.slug} to={`/programmes/${o.slug}`} className="btn-outline bg-white">{o.title}</Link>)}</div>
      </div></section>
      <CtaBand />
    </>
  )
}
