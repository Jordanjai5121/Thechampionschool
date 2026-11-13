import type { GalleryItem, Programme } from './types'

const m = (f: string) => `/media/img/${f}`
const v = (f: string) => `/media/vid/${f}`

export const CATEGORIES = [
  'School Campus', 'Classrooms', 'Student Activities', 'Technology', 'Science Activities',
  'Sports', 'Educational Programmes', 'School Events', 'Promotional Videos',
] as const

export const DEFAULT_SETTINGS = {
  school: {
    name: 'The Champions Matriculation Hr. Sec. School',
    city: 'Madurai, Tamil Nadu, India',
    tagline: 'Strong Foundations. Bright Futures. Champions for Life.',
    welcome:
      'At The Champions, we believe every child has unique potential. Our mission is to combine academic excellence with practical knowledge, sports, technology, communication, creativity and character development.',
    vision: 'To nurture young minds and shape confident, capable and responsible future citizens and leaders.',
    mission:
      'To combine academic excellence with practical knowledge, sports, technology, communication, creativity and character development, so that every child discovers and develops their potential.',
    philosophy:
      'Education is not merely about academic achievement; it is about preparing children for life. Success is measured not only by academic results but also by the character, skills and values our students carry into the world.',
  },
  leaders: {
    chairman: {
      name: 'Mr. M. Jegadeeswaran', title: 'Chairman', photo: m('chairman.webp'),
      message: [
        'Dear Parents, Students, and Well-Wishers,',
        'It gives me immense pleasure to welcome you to The Champions Matriculation Hr. Sec. School, an institution envisioned to nurture young minds, discover individual potential, and shape confident, capable, and responsible future citizens.',
        'I firmly believe that education is not merely about academic achievement; it is about preparing children for life. Every child possesses unique talents, aspirations, and abilities. Our responsibility as educators is to recognise these strengths, provide the right guidance, and create opportunities for every student to grow, explore, and excel.',
        'At The Champions, we aspire to create a learning environment where academic excellence goes hand in hand with practical knowledge, sports, technology, communication, creativity, and character development. We want our students to think independently, communicate confidently, work collaboratively, and approach challenges with courage and determination.',
        'With my background in education and sports, I strongly believe that discipline, teamwork, perseverance, and sportsmanship are essential qualities for success. We aim to provide our students with meaningful opportunities to develop these qualities while maintaining a strong foundation in academics and values.',
        'Our commitment is to work closely with parents and educators to ensure that every child feels encouraged, respected, supported, and inspired to achieve their best. Together, we can build a school culture that values effort as much as achievement, integrity as much as success, and kindness as much as excellence.',
        'As we begin this journey, I invite you to become a valued partner in our vision. Your trust and support will be instrumental in creating an institution that prepares children not only to succeed in examinations, but also to thrive in an ever-changing world.',
        'At The Champions, our ambition is not simply to educate students, but to empower every child to discover their potential and become a champion in life.',
        'With warm regards and best wishes,',
      ],
    },
    ceo: {
      name: 'Mr. Saravanabalaji Mariappan', title: 'Chief Executive Officer', photo: m('ceo.webp'),
      message: [
        'Dear Parents, Students, and Well-Wishers,',
        'It is my privilege to be part of The Champions Matriculation Hr. Sec. School, where our vision is to nurture young minds and shape confident, responsible future leaders.',
        'I believe that every child has unique potential, and true education lies in discovering and developing it. Our focus is to combine academic excellence with sports, technology, life skills, and value-based learning, ensuring the holistic development of every student.',
        'Together with our dedicated teachers and supportive parents, we strive to create an environment where students learn with curiosity, grow with confidence, and achieve with integrity. Our success will be measured not only by academic results but also by the character, skills, and values our students carry into the world.',
        'Let us work together to build a generation of confident, compassionate, and capable Champions for Life.',
        'Warm regards,',
      ],
    },
  },
  // Leave a field empty and it stays hidden on the public site until verified details are entered.
  contact: { address: '', phone: '', email: '', whatsapp: '', map_embed: '', facebook: '', instagram: '', youtube: '' },
  admissions: {
    open: false,
    banner: 'Admissions Open',
    academic_year: '',
    classes: [] as string[],
    eligibility: '',
    documents: [] as string[],
    dates: [] as { label: string; date: string }[],
    procedure: [
      { t: 'Submit an enquiry', d: 'Fill in the admission enquiry form online. You receive a reference number straight away.' },
      { t: 'We contact you', d: 'The school office reaches out to you about the next steps.' },
      { t: 'Campus visit and discussion', d: 'Meet the team, see the classrooms and ask your questions.' },
      { t: 'Documents and confirmation', d: 'Complete the formalities communicated by the school office.' },
    ],
    faqs: [] as { q: string; a: string }[],
  },
  academics: {
    classes: '', curriculum: '', calendar: '', methodology: '', assessment: '',
    activities: '', homework: '', parent_teacher: '', achievements: '',
  },
  sports: { categories: [] as string[], achievements: [] as string[] },
  facilities: [] as { title: string; text: string }[],
}
export type Settings = typeof DEFAULT_SETTINGS

type P = Omit<Programme, 'published' | 'sort'>
const prog = (p: P, sort: number): Programme => ({ ...p, published: true, sort })

export const DEFAULT_PROGRAMMES: Programme[] = [
  prog({
    slug: 'champions-techno', title: 'Champions Techno', icon: 'cpu',
    theme: 'Technology Education for a Future Generation',
    tagline: 'Build Logic. Solve Problems. Create the Future.',
    summary: 'Hands-on technology learning that builds logical thinking, problem-solving and responsible use of technology.',
    poster_url: m('poster-techno.webp'), hero_url: v('robotics.mp4'),
    points: ['Basic technology education', 'Logical thinking', 'Problem-solving', 'Creative technology activities', 'Design, Build, Test and Improve', 'Robotics and electronics awareness', 'Responsible technology usage', 'Hands-on learning'],
    objectives: ['Build logical thinking through hands-on activities', 'Introduce robotics and electronics in an age-appropriate way', 'Practise the design, build, test and improve cycle', 'Encourage safe and responsible use of technology'],
    outcomes: ['Children become capable and responsible creators of technology', 'Confident problem-solvers who can test and improve their ideas'],
  }, 1),
  prog({
    slug: 'champions-life-skills', title: 'Champions Life Skills', icon: 'wallet',
    theme: 'Practical Skills for Real Life',
    tagline: 'Smart Choices. Independent Lives.',
    summary: 'Everyday money, health, safety and decision-making skills that children rarely get from textbooks.',
    poster_url: m('poster-life-skills.webp'), hero_url: v('speaking.mp4'),
    points: ['Financial literacy', 'Bank accounts and digital payments', 'Savings and budgeting', 'Understanding interest', 'Responsible borrowing', 'Online safety and fraud awareness', 'Basic first aid', 'Personal hygiene', 'Health and wellness', 'Basic cooking skills', 'Consumer awareness', 'Understanding bills, receipts and GST', 'Independent decision-making'],
    objectives: ['Understand how money, savings and digital payments work', 'Recognise online fraud and stay safe', 'Learn first aid, hygiene and healthy routines', 'Make independent and responsible decisions'],
    outcomes: ['Students learn how to manage everyday responsibilities', 'Smart, safe and independent decision-makers'],
  }, 2),
  prog({
    slug: 'champions-think', title: 'Champions Think', icon: 'lightbulb',
    theme: 'Critical Thinking, Creativity and Problem-Solving',
    tagline: 'Question. Explore. Create. Solve.',
    summary: 'Curiosity-led learning where students ask questions, research, build and solve real-world problems.',
    poster_url: m('poster-think.webp'), hero_url: v('experiment.mp4'),
    points: ['Curiosity-based learning', 'Asking questions', 'Research and analysis', 'Creative thinking', 'Team projects', 'Design challenges', 'Innovation', 'Evidence-based decisions', 'Real-world problem-solving', 'Independent thinking'],
    objectives: ['Encourage children to ask why and how', 'Teach research and analysis from reliable evidence', 'Work in teams on design challenges', 'Apply ideas to real-world problems'],
    outcomes: ['Students think independently rather than only memorise', 'Creative, evidence-minded problem-solvers'],
  }, 3),
  prog({
    slug: 'champions-voice', title: 'Champions Voice', icon: 'mic',
    theme: 'Spoken English, Communication and Confidence',
    tagline: 'Find Your Voice. Shape Your Future.',
    summary: 'Daily speaking, listening, reading and writing practice in English and Tamil that builds confidence.',
    poster_url: m('poster-voice.webp'), hero_url: v('voice.mp4'),
    points: ['Spoken English', 'Tamil communication', 'Daily speaking activities', 'Listening skills', 'Public speaking', 'Storytelling', 'Debates', 'Reading comprehension', 'Creative writing', 'Confidence development', 'Effective communication'],
    objectives: ['Speak clearly and confidently in English and Tamil', 'Listen actively and respond thoughtfully', 'Present ideas through stories, debates and speeches', 'Read with understanding and write creatively'],
    outcomes: ['Confident communicators with better opportunities ahead', 'Students who are not afraid to speak up'],
  }, 4),
  prog({
    slug: 'champions-career', title: 'Champions Career', icon: 'compass',
    theme: 'Career Awareness and Vocational Exposure',
    tagline: 'Explore Today. Build Tomorrow.',
    summary: 'Early exposure to careers and practical vocations through talks, visits, projects and guidance.',
    poster_url: m('poster-career.webp'), hero_url: v('science-lab.mp4'),
    points: ['Robotics and electronics', 'Introduction to engineering', 'Healthcare awareness', 'Basic first aid', 'Gardening and agriculture', 'Art and craft', 'Design thinking', 'Entrepreneurship', 'Financial literacy', 'Career talks', 'Industry visits', 'Workplace exposure', 'Aptitude assessments', 'Career guidance'],
    objectives: ['Expose students to a wide range of careers', 'Build hands-on vocational awareness', 'Understand interests and strengths through aptitude assessments', 'Guide students with age-appropriate career conversations'],
    outcomes: ['Students understand the world of work and their own strengths', 'Better-informed choices about future study and careers'],
  }, 5),
  prog({
    slug: 'champions-emote', title: 'Champions Emote', icon: 'heart',
    theme: 'Emotional Intelligence and Social Skills',
    tagline: 'Be Aware. Be Kind. Be Connected.',
    summary: 'Building emotional awareness, empathy, teamwork and healthy habits for a balanced school life.',
    poster_url: m('poster-emote.webp'), hero_url: v('new-beginnings.mp4'),
    points: ['Emotional awareness', 'Identifying and expressing feelings', 'Empathy', 'Respect', 'Stress management', 'Handling frustration and failure', 'Teamwork', 'Conflict resolution', 'Anti-bullying awareness', 'Self-discipline', 'Time management', 'Healthy habits', 'Mental and emotional wellbeing'],
    objectives: ['Recognise and express feelings in healthy ways', 'Practise empathy, respect and teamwork', 'Handle stress, frustration and failure', 'Build self-discipline and healthy habits'],
    outcomes: ['Children learn to manage themselves and work well with others', 'A kind, connected and respectful school community'],
  }, 6),
]

const g = (category: string, kind: 'image' | 'video', title: string, url: string, poster?: string): GalleryItem =>
  ({ category, kind, title, url, poster_url: poster ?? null, published: true, sort: 0 })

export const DEFAULT_GALLERY: GalleryItem[] = [
  g('School Campus', 'image', 'School building and entrance', m('campus-front.webp')),
  g('School Campus', 'image', 'Courtyard and campus walls', m('campus-courtyard.webp')),
  g('School Campus', 'image', 'Staircase and building facade', m('campus-building.webp')),
  g('Classrooms', 'image', 'Classroom', m('classroom.webp')),
  g('Classrooms', 'image', 'Corridor', m('corridor-1.webp')),
  g('Classrooms', 'image', 'Classroom corridor', m('corridor-2.webp')),
  g('Educational Programmes', 'image', 'Champions Techno', m('poster-techno.webp')),
  g('Educational Programmes', 'image', 'Champions Life Skills', m('poster-life-skills.webp')),
  g('Educational Programmes', 'image', 'Champions Think', m('poster-think.webp')),
  g('Educational Programmes', 'image', 'Champions Voice', m('poster-voice.webp')),
  g('Educational Programmes', 'image', 'Champions Career', m('poster-career.webp')),
  g('Educational Programmes', 'image', 'Champions Emote', m('poster-emote.webp')),
  g('Student Activities', 'video', 'Speak with confidence', v('speaking.mp4'), v('speaking.webp')),
  g('Student Activities', 'video', 'Listen. Speak. Improve.', v('voice.mp4'), v('voice.webp')),
  g('Student Activities', 'video', 'Question everything', v('experiment.mp4'), v('experiment.webp')),
  g('Technology', 'video', 'Robotics', v('robotics.mp4'), v('robotics.webp')),
  g('Science Activities', 'video', 'Science: plant cells', v('science-cells.mp4'), v('science-cells.webp')),
  g('Science Activities', 'video', 'Ask. Test. Discover.', v('science-lab.mp4'), v('science-lab.webp')),
  g('Sports', 'video', 'We see potential', v('sports.mp4'), v('sports.webp')),
  g('Promotional Videos', 'video', 'A new beginning', v('new-beginnings.mp4'), v('new-beginnings.webp')),
]
