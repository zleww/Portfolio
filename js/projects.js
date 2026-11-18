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
    note: 'Deployed and working, but no real members use it yet. A trial run with the gym is planned. Screenshots show test data.',
    problem: 'A local gym runs everything on paper. Members sign a handwritten logbook, memberships are paper cards whose expiry is easy to miss (so expired members walk in), and there is no single record of cash and GCash payments, so the owner cannot see revenue or growth.',
    solution: 'A web app that runs on any phone. Staff search a member and see a large Active, Expiring or Expired status, and expired members get a Renew button instead of Check in. Every payment is tied to the staff member who took it, prices come from the server so they cannot be changed at the desk, mistakes are voided with a reason and never deleted, and the day closes with a blind cash count. The owner gets revenue reports, payroll with SSS, PhilHealth, Pag-IBIG and withholding tax worked out, an activity log and CSV backups.',
    role: 'Full stack, solo project: design, database, front end, security, testing and deployment',
    rows: [
      { label: 'Security and privacy', text: 'The database itself enforces who can see what, so staff cannot see revenue even by going around the app. Two-step sign-in, and member data can be deleted on request in line with the Philippine Data Privacy Act. 136 automated tests cover these rules.' }
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel', 'Vitest', 'GitHub Actions'],
    images: [
      { src: 'assets/projects/laced-1.webp', alt: 'Laced landing page: gym management for small gyms still on paper, with a member check-in card' },
      { src: 'assets/projects/laced-2.webp', alt: 'Laced owner dashboard with money collected today, check-ins and revenue trends (test data)' },
      { src: 'assets/projects/laced-3.webp', alt: 'Laced check-in screen selling a day pass to a walk-in, paid with cash or GCash' },
      { src: 'assets/projects/laced-4.webp', alt: 'Laced reports page with revenue by month and a month by month table (test data)' }
    ],
    links: [
      { label: 'Live site', url: 'https://laced-rho.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/zleww/Laced' }
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
      { src: 'assets/projects/lawliet-1.webp', alt: 'L-Lawliet home page: Understand the Law, Empower Yourself, with a law search bar and categories' },
      { src: 'assets/projects/lawliet-2.webp', alt: 'L-Lawliet log in page with an option to continue as a guest' },
      { src: 'assets/projects/lawliet-3.webp', alt: 'L-Lawliet admin dashboard listing laws with edit and delete buttons' },
      { src: 'assets/projects/lawliet-4.webp', alt: 'L-Lawliet user profile with saved laws, law suggestions and notes' }
    ],
    links: [
      { label: 'Live site', url: 'https://l-lawliet-three.vercel.app' },
      { label: 'API docs', url: 'https://l-lawliet-three.vercel.app/docs' },
      { label: 'GitHub', url: 'https://github.com/zleww/L-Lawliet' }
    ]
  }

  // TODO: add the others
  // copy a block above to add the next project
];
