import { Link } from 'react-router-dom'
import { Award, BookOpenCheck, CalendarDays, ClipboardCheck, GraduationCap, HeartHandshake, Layers, Library, Trophy, Users } from 'lucide-react'
import { useGallery, useSettings } from '../lib/data'
import { CtaBand, Heading, PageHeader, Pending, useSeo } from '../components/ui'
import { LeaderCard, VideoTile } from '../components/Media'

const values = [
  ['Academic Excellence', 'Strong concepts and consistent effort.'], ['Discipline', 'Respect for time, people and responsibility.'],
  ['Sportsmanship', 'Playing fair, winning humbly, learning from defeat.'], ['Innovation', 'Curiosity that turns into new ideas.'],
  ['Confidence', 'Speaking up and trying again.'], ['Creativity', 'Many ways to solve a problem.'],
  ['Leadership', 'Guiding others with integrity.'], ['Character', 'Kindness as much as excellence.'],
]

export function About() {
  const { data: s } = useSettings()
  useSeo('About Us', 'Vision, mission, philosophy and leadership of The Champions Matriculation Hr. Sec. School, Madurai.')
  return (
    <>
      <PageHeader title="About The Champions" sub="Education that goes beyond examination results and prepares students for real-life challenges." image="/media/img/campus-courtyard.webp" />
      <section className="section"><div className="wrap grid gap-10 lg:grid-cols-2">
        <div><Heading title="Who we are" /><p className="lead">{s.school.name} in {s.school.city.split(',')[0]} is built on one belief: every child has unique potential, and true education lies in discovering and developing it.</p>
          <p className="mt-4 leading-relaxed text-slate-600">{s.school.philosophy}</p></div>
        <img src="/media/img/campus-front.webp" alt="School entrance" loading="lazy" className="rounded-2xl object-cover shadow-lg" />
      </div></section>
      <section className="section bg-ash"><div className="wrap grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold">Our vision</h2><p className="mt-3 leading-relaxed text-slate-600">{s.school.vision}</p></div>
        <div className="rounded-2xl bg-navy-800 p-8 text-white shadow-sm"><h2 className="text-2xl font-bold !text-white">Our mission</h2><p className="mt-3 leading-relaxed text-white/85">{s.school.mission}</p></div>
      </div></section>
      <section className="section"><div className="wrap">
        <Heading title="Our approach" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[[Layers, 'Teaching and learning', 'Hands-on activities, questions and projects sit beside the classroom syllabus.'],
            [HeartHandshake, 'Holistic development', 'Mind, body and character grow together: academics, sports, technology, communication and creativity.'],
            [Trophy, 'Academics and activities in balance', 'Effort matters as much as achievement. Co-curricular time is part of the school day, not an extra.'],
            [Users, 'Parent-school partnership', 'We work closely with parents so every child feels encouraged, respected and supported.']].map(([I, t, d]: any) => (
            <div key={t} className="rounded-2xl border border-slate-200 p-6"><I className="text-brand" size={28} /><h3 className="mt-3 font-sans text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p></div>
          ))}
        </div>
      </div></section>
      <section className="section bg-navy-900 text-white"><div className="wrap">
        <h2 className="h2 !text-white">Core values</h2><div className="mt-3 h-1 w-14 rounded bg-brand" />
        <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(([t, d]) => <div key={t} className="border-t border-white/20 pt-4"><dt className="font-display text-xl font-bold text-brand">{t}</dt><dd className="mt-1 text-sm text-white/75">{d}</dd></div>)}
        </dl>
      </div></section>
      <section id="leadership" className="section scroll-mt-20"><div className="wrap">
        <Heading title="Leadership messages" />
        <div className="mt-10 space-y-8"><LeaderCard l={s.leaders.chairman} full /><LeaderCard l={s.leaders.ceo} full /></div>
      </div></section>
      <CtaBand />
    </>
  )
}

const acad: [string, string, any][] = [
  ['classes', 'Classes offered', GraduationCap], ['curriculum', 'Curriculum details', Library], ['calendar', 'Academic calendar', CalendarDays],
  ['methodology', 'Teaching methodology', Layers], ['assessment', 'Assessment and examinations', ClipboardCheck], ['activities', 'Academic activities', BookOpenCheck],
  ['homework', 'Homework and learning support', BookOpenCheck], ['parent_teacher', 'Parent-teacher communication', Users], ['achievements', 'Academic achievements', Award],
]

export function Academics() {
  const { data: s } = useSettings()
  useSeo('Academics', 'Academic information at The Champions Matriculation Hr. Sec. School, Madurai.')
  const a = s.academics as Record<string, string>
  const filled = acad.filter(([k]) => a[k]?.trim())
  return (
    <>
      <PageHeader title="Academics" sub="A strong academic foundation with practical learning built around it." image="/media/img/classroom.webp" />
      <section className="section"><div className="wrap">
        <Heading title="How learning works at Champions" sub="Concepts first, then practice: classroom learning is supported by the six Champions programmes." />
        {filled.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filled.map(([k, t, I]) => (
              <div key={k} className="rounded-2xl border border-slate-200 p-6"><I className="text-brand" size={24} /><h3 className="mt-2 font-sans text-lg font-bold">{t}</h3><p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">{a[k]}</p></div>
            ))}
          </div>
        ) : (
          <div className="mt-10"><Pending>Detailed academic information such as classes offered, curriculum, calendar and assessment is published here once the school adds verified details in the admin dashboard.</Pending>
            <p className="mt-6 text-slate-600">For the latest information, please <Link to="/contact" className="font-semibold text-navy-700 underline">contact the school office</Link>.</p></div>
        )}
      </div></section>
      <CtaBand />
    </>
  )
}

export function Sports() {
  const { data: s } = useSettings()
  const { data: gal } = useGallery()
  useSeo('Sports & Activities', 'Sports, fitness, teamwork and sportsmanship at The Champions Matriculation Hr. Sec. School, Madurai.')
  const vids = gal.filter((g) => g.kind === 'video' && ['Sports', 'Student Activities', 'Science Activities', 'Technology'].includes(g.category))
  const q = ['Physical fitness', 'Teamwork', 'Discipline', 'Sportsmanship', 'Leadership', 'Confidence', 'Perseverance']
  return (
    <>
      <PageHeader title="Sports & Activities" sub="Our chairman believes discipline, teamwork, perseverance and sportsmanship are essential qualities for success." image="/media/img/campus-courtyard.webp" />
      <section className="section"><div className="wrap">
        <Heading title="What sport builds in a child" />
        <div className="mt-8 flex flex-wrap gap-3">{q.map((x) => <span key={x} className="rounded-full bg-navy-50 px-5 py-2.5 text-sm font-semibold text-navy-800">{x}</span>)}</div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">{vids.slice(0, 4).map((v) => <VideoTile key={v.url} src={v.url} poster={v.poster_url} title={v.title} className="aspect-[9/14]" />)}</div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div><h3 className="text-2xl font-bold">Sports categories</h3>
            {s.sports.categories.length ? <ul className="mt-4 grid grid-cols-2 gap-2 text-slate-700">{s.sports.categories.map((c) => <li key={c} className="rounded-lg bg-ash px-4 py-2">{c}</li>)}</ul> : <div className="mt-4"><Pending>Sports offered will be listed here once confirmed by the school.</Pending></div>}</div>
          <div><h3 className="text-2xl font-bold">Achievements</h3>
            {s.sports.achievements.length ? <ul className="mt-4 space-y-2 text-slate-700">{s.sports.achievements.map((c) => <li key={c} className="flex gap-2"><Trophy size={18} className="mt-0.5 shrink-0 text-brand" />{c}</li>)}</ul> : <div className="mt-4"><Pending>Achievements will be published here once the school adds them.</Pending></div>}</div>
        </div>
      </div></section>
      <CtaBand />
    </>
  )
}

export function Campus() {
  const { data: s } = useSettings()
  useSeo('Campus & Facilities', 'Explore the campus, classrooms and corridors of The Champions Matriculation Hr. Sec. School, Madurai.')
  const shots = [
    ['campus-front', 'School building and main entrance', 'The branded front of the school and its entrance.'],
    ['campus-building', 'Building architecture', 'A navy-and-orange facade with an open staircase and learning-themed wall graphics.'],
    ['campus-courtyard', 'Campus courtyard', 'A green courtyard with student-themed wall art.'],
    ['classroom', 'Classroom', 'Bright classrooms with bench seating and a chalkboard wall.'],
    ['corridor-1', 'Corridors', 'Wide, airy corridors with inspirational wall graphics.'],
    ['corridor-2', 'Learning environment', 'Corridors lined with classrooms and motivating messages.'],
  ]
  return (
    <>
      <PageHeader title="Campus & Facilities" sub="A bright, welcoming campus designed around learning." image="/media/img/campus-building.webp" />
      <section className="section"><div className="wrap space-y-16">
        {shots.map(([f, t, d], i) => (
          <article key={f} className={`grid items-center gap-8 lg:grid-cols-5 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <img src={`/media/img/${f}.webp`} alt={t} loading="lazy" className="max-h-[480px] w-full rounded-2xl object-cover shadow-lg lg:col-span-3" />
            <div className="lg:col-span-2"><h2 className="text-2xl font-bold">{t}</h2><div className="mt-2 h-1 w-12 rounded bg-brand" /><p className="mt-4 leading-relaxed text-slate-600">{d}</p></div>
          </article>
        ))}
        {s.facilities.length > 0 && (
          <div><Heading title="More facilities" /><div className="mt-8 grid gap-6 md:grid-cols-3">{s.facilities.map((f) => <div key={f.title} className="rounded-2xl border border-slate-200 p-6"><h3 className="font-sans text-lg font-bold">{f.title}</h3><p className="mt-2 text-sm text-slate-600">{f.text}</p></div>)}</div></div>
        )}
      </div></section>
      <CtaBand />
    </>
  )
}
