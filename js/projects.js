// All my projects. main.js builds the project sections from this list:
// - index.html shows the ones with featured: true (max 5) as the Starting Five
// - roster.html shows every project
//
// status: 'Live', 'Live prototype', 'Finished', 'In progress' or 'In planning'
// use "plan" for something not built yet, "solution" for something finished
// images: put the pictures in assets/projects/ and list the paths, like ['assets/projects/gym-1.webp', 'assets/projects/gym-2.webp']
//   the first one is the big picture, the rest show as small thumbnails you can click
//   while the list is empty the site shows image placeholders
//   an image can also be { src: '...', alt: 'what the picture shows' }
// note: a short line under the summary. rows: extra { label, text } rows
// links look like { label: 'Live site', url: 'https://...' }

window.PROJECTS = [
  {
    number: '01',
    title: 'Laced',
    kind: 'Gym Management System',
    status: 'Live prototype',
    featured: true,
    summary: 'A phone-first gym management system for small gyms that still run on paper. Front-desk staff check members in, sell and renew plans, and record cash and GCash payments. The owner gets revenue reports, payroll and an activity log.',
    note: 'Deployed and working, but no real members use it yet. A trial run with the gym is planned. Screenshots show demo data.',
    problem: 'A local gym runs everything on paper. Members sign a handwritten logbook, memberships are paper cards whose expiry is easy to miss (so expired members walk in), and there is no single record of cash and GCash payments, so the owner cannot see revenue or growth.',
    solution: 'A web app that runs on any phone. Staff search a member and see a large Active, Expiring or Expired status, and expired members get a Renew button instead of Check in. Every payment is tied to the staff member who took it, prices come from the server so they cannot be changed at the desk, mistakes are voided with a reason and never deleted, and the day closes with a blind cash count. The owner gets revenue reports, payroll with SSS, PhilHealth, Pag-IBIG and withholding tax worked out, an activity log and CSV backups.',
    role: 'Full stack, solo project: design, database, front end, security, testing and deployment',
    rows: [
      { label: 'Security and privacy', text: 'The database itself enforces who can see what, so staff cannot see revenue even by going around the app. Two-step sign-in, and member data can be deleted on request in line with the Philippine Data Privacy Act. 136 automated tests cover these rules.' }
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel', 'Vitest', 'GitHub Actions'],
    images: [
      { src: 'assets/projects/laced-1.webp', alt: 'Laced landing page: gym management for small gyms still on paper, built for Philippine gyms' },
      { src: 'assets/projects/laced-2.webp', alt: 'Laced owner dashboard with money collected today, check-ins, revenue trends and renewals due (demo data)' },
      { src: 'assets/projects/laced-3.webp', alt: 'Laced: off paper in three steps, next to the phone members list showing active, expiring and expired plans (demo data)' },
      { src: 'assets/projects/laced-4.webp', alt: 'Laced closing section: move your gym off the paper logbook, with request a demo and sign in buttons' }
    ],
    links: [
      { label: 'Live site', url: 'https://laced-lp.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/zleww/laced_lp' }
    ]
  },
  {
    number: '02',
    title: 'ReserBa',
    kind: 'HOA Amenity Booking',
    status: 'In progress',
    featured: true,
    summary: 'An amenity booking system for a homeowners association, with conflict detection so the same amenity cannot be booked twice for the same time.',
    role: 'Full stack, group project (Software Engineering 2)',
    stack: ['HTML', 'CSS', 'React'],
    images: [],
    imageAlt: '',
    links: []
  },
  {
    number: '03',
    title: 'L-Lawliet',
    kind: 'Philippine Law Explorer & API',
    status: 'Live',
    featured: true,
    summary: 'A web app that explains Philippine Republic Acts in plain English for ordinary Filipinos and students. Visitors browse, search and filter laws, signed-in users save, rate and add notes, and admins manage the content. Its API also supplies law data to two partner sites, JurisCard and JustGiveupATP.',
    note: 'Live and in use. Still being extended as a school project for CS Elective 1: Cloud Computing.',
    problem: 'Philippine laws are written in legal language most people cannot follow. The first version also kept all 30 laws inside the code, so updating a law meant a redeploy, user notes vanished whenever the server restarted, and one shared API key could not tell users apart.',
    solution: 'Moved everything into a cloud PostgreSQL database (8 tables), so data survives restarts and admins edit laws without touching code. Added accounts with three levels: guests preview 10 laws, users read all of them and interact, and admins manage content. Plus saved laws, 1 to 5 ratings, helpful votes, note reports, law suggestions, profiles, an admin dashboard and a dedicated phone layout.',
    role: 'Full stack, solo project: database design, API, front end, deployment, tests and documentation',
    rows: [
      { label: 'Security', text: 'Passwords are hashed and login tokens are signed and expire. Five wrong passwords lock the account for a while, and the database itself enforces who may change which rows (Row-Level Security), so a bug in the API cannot get around it.' }
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Python', 'FastAPI', 'Pydantic', 'PostgreSQL', 'Neon', 'JWT', 'Vercel', 'Swagger', 'Git'],
    images: [
      { src: 'assets/projects/lawliet-1.webp', alt: 'L-Lawliet landing page: Read the law the way you study it, with start reading and browse as a guest buttons' },
      { src: 'assets/projects/lawliet-2.webp', alt: 'L-Lawliet browse page listing Republic Acts with a search bar, category filters and a guest view notice' },
      { src: 'assets/projects/lawliet-3.webp', alt: 'L-Lawliet how it works: find it fast, read the plain version, learn from classmates, next to a search for data privacy' },
      { src: 'assets/projects/lawliet-4.webp', alt: 'L-Lawliet home page: Philippine laws in plain English, with a search bar and a statue of Lady Justice' }
    ],
    links: [
      { label: 'Live site', url: 'https://l-lawliet-three.vercel.app' },
      { label: 'API docs', url: 'https://l-lawliet-three.vercel.app/docs' },
      { label: 'GitHub', url: 'https://github.com/zleww/L-Lawliet' }
    ]
  },
  {
    number: '04',
    title: 'JurisCards',
    kind: 'Philippine Law Flashcards & Quiz App',
    status: 'Live',
    featured: false,
    summary: 'A study site with flashcards and practice quizzes for Philippine Republic Acts. Guests can try it, and signed-in users get saved progress, their own cards and quiz history.',
    note: 'Shares one database and account system with L-Lawliet. Guests can study 10 laws.',
    problem: 'There is too much law to study, which makes it hard for students to remember the details.',
    solution: 'Every Republic Act becomes a flashcard with the question on the front and the law, an example and the penalties on the back. Mark cards Mastered or For review, shuffle a new set of 20, or write your own cards. Practice quizzes use the same laws: guests get 5 questions, signed-in users pick 5 to 20 and their scores are saved. A review page shows progress by category, a daily goal and quiz history, and every law has student notes shared with L-Lawliet.',
    role: 'Solo project, school project',
    rows: [
      { label: 'Connected to L-Lawliet', text: 'JurisCards has no database of its own. It reads and writes everything through the L-Lawliet API, so a law added there becomes a new card here, and one account works on both sites. The 10-law guest limit and every save are enforced by the API and by row-level security in the database, not only by the pages.' },
      { label: 'Access levels', text: 'Guest, user and admin. Guests study 10 laws, signed-in users get every law, and admins also get a page with accounts and study activity.' }
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'GSAP', 'Python', 'FastAPI', 'PostgreSQL', 'Neon', 'JWT', 'Vercel'],
    images: [
      { src: 'assets/projects/juriscards-1.webp', alt: 'JurisCards landing page: Know the law on exam day, not just the night before, with start studying and guest buttons' },
      { src: 'assets/projects/juriscards-2.webp', alt: 'JurisCards landing page comparing the old way of rereading notes with the JurisCards way: answer before you flip, mark what you know, quiz on the details' },
      { src: 'assets/projects/juriscards-3.webp', alt: 'JurisCards how it works: open the deck, flip and mark it, test yourself, next to a flashcard page showing a Cybercrime Prevention Act question' },
      { src: 'assets/projects/juriscards-4.webp', alt: 'JurisCards study home as a guest, showing study modes for flashcards, browse laws, my cards and practice quiz, with an overview of cards studied' }
    ],
    links: [
      { label: 'Live site', url: 'https://juris-card.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/zleww/JurisCard' }
    ]
  }

  // TODO: add the others
  // copy a block above to add the next project
];
