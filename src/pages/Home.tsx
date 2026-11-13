import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Briefcase, Cpu, Heart, Lightbulb, MessageCircle, Trophy, Wallet } from 'lucide-react'
import { useProgrammes, useSettings, useGallery } from '../lib/data'
import { CtaBand, Heading, ICONS, useSeo } from '../components/ui'
import { LeaderCard, VideoTile } from '../components/Media'

const why = [
  { i: BookOpen, t: 'Strong Academic Foundation', d: 'Clear concepts and a steady base for every subject.' },
  { i: Cpu, t: 'Technology-Based Learning', d: 'Robotics, electronics and logic-building from an early age.' },
  { i: Trophy, t: 'Sports and Physical Education', d: 'Fitness, teamwork and sportsmanship every week.' },
  { i: MessageCircle, t: 'Communication Skills', d: 'Spoken English and Tamil, public speaking and storytelling.' },
  { i: Lightbulb, t: 'Critical Thinking', d: 'Questions, research and evidence before answers.' },
  { i: Wallet, t: 'Practical Life Skills', d: 'Money, safety, health and everyday decision-making.' },
  { i: Briefcase, t: 'Career Awareness', d: 'Early exposure to careers, vocations and guidance.' },
  { i: Heart, t: 'Emotional Intelligence', d: 'Empathy, respect, resilience and healthy habits.' },
]

export default function Home() {
  const { data: s } = useSettings()
  const { data: progs } = useProgrammes()
  const { data: gallery } = useGallery()
  useSeo('Home', 'The Champions Matriculation Hr. Sec. School, Madurai. Academic excellence with technology, life skills, communication, sports, career awareness and emotional intelligence.')
  const videos = gallery.filter((g) => g.kind === 'video').slice(0, 4)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <img src="/media/img/campus-front.webp" alt="The Champions school building and entrance" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/20" />
        <div className="stripe absolute inset-x-0 bottom-0 -z-10 h-24 opacity-90" />
        <div className="wrap flex min-h-[78vh] flex-col justify-center py-20">
          <img src="/media/img/logo.webp" alt="" className="rise mb-8 h-20 w-auto self-start rounded sm:h-24" />
          <h1 className="rise rise-2 max-w-3xl text-4xl font-bold leading-tight !text-white sm:text-6xl">The Champions Matriculation Hr. Sec. School</h1>
          <p className="rise rise-3 mt-5 max-w-xl font-display text-xl italic text-brand sm:text-2xl">{s.school.tagline}</p>
          <div className="rise rise-3 mt-9 flex flex-wrap gap-3">
            <Link to="/about" className="btn-brand">Discover Our School</Link>
            <Link to="/admissions#enquiry" className="btn-ghost">Admissions Enquiry</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Heading title="Every child has unique potential" />
            <p className="lead">{s.school.welcome}</p>
            <Link to="/about" className="btn-outline mt-7">About our school <ArrowRight size={16} /></Link>
          </div>
          <div className="relative">
            <img src="/media/img/campus-courtyard.webp" alt="Campus courtyard with student-themed wall art" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" />
            <img src="/media/img/classroom.webp" alt="A bright Champions classroom" loading="lazy" className="absolute -bottom-8 -left-4 hidden w-1/2 rounded-xl border-4 border-white object-cover shadow-xl sm:block" />
          </div>
        </div>
      </section>

      <section className="section bg-ash">
        <div className="wrap">
          <Heading title="Why choose Champions?" sub="Eight things we build into every school day, alongside the syllabus." />
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ i: Icon, t, d }) => (
              <div key={t} className="border-l-4 border-brand pl-4">
                <Icon className="text-navy-700" size={26} />
                <h3 className="mt-3 font-sans text-base font-bold text-navy-800">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Heading title="Our six signature programmes" sub="Six programmes that sit beside academics and teach children how to think, speak, earn, care and create." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {progs.map((p) => {
              const Icon = ICONS[p.icon ?? 'lightbulb'] ?? Lightbulb
              return (
                <Link key={p.slug} to={`/programmes/${p.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-52 overflow-hidden bg-navy-50"><img src={p.poster_url} alt={`${p.title} programme poster`} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" /></div>
                  <div className="p-6">
                    <Icon className="text-brand" size={24} />
                    <h3 className="mt-2 text-xl font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700">Learn more <ArrowRight size={15} /></span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section bg-ash">
        <div className="wrap">
          <Heading title="Leadership" sub="Messages from the people guiding the school." />
          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            <LeaderCard l={s.leaders.chairman} /><LeaderCard l={s.leaders.ceo} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Heading title="Campus highlights" />
            <Link to="/campus" className="btn-outline">Explore the campus</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:h-[520px]">
            <img src="/media/img/campus-building.webp" alt="School building with staircase and branding" loading="lazy" className="col-span-2 row-span-2 h-full min-h-64 w-full rounded-2xl object-cover object-top" />
            <img src="/media/img/corridor-1.webp" alt="Bright school corridor" loading="lazy" className="h-40 w-full rounded-2xl object-cover lg:h-full" />
            <img src="/media/img/classroom.webp" alt="Classroom" loading="lazy" className="h-40 w-full rounded-2xl object-cover lg:h-full" />
            <img src="/media/img/campus-courtyard.webp" alt="Courtyard" loading="lazy" className="h-40 w-full rounded-2xl object-cover lg:h-full" />
            <img src="/media/img/corridor-2.webp" alt="Classroom corridor" loading="lazy" className="h-40 w-full rounded-2xl object-cover lg:h-full" />
          </div>
        </div>
      </section>

      <section className="section bg-navy-900 text-white">
        <div className="wrap">
          <h2 className="h2 !text-white">Student development in action</h2>
          <div className="mt-3 h-1 w-14 rounded bg-brand" />
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {videos.map((v) => <VideoTile key={v.url} src={v.url} poster={v.poster_url} title={v.title} className="aspect-[9/14]" />)}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
