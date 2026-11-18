// All my projects. main.js builds the project sections from this list:
// - index.html shows the ones with featured: true (max 5) as the Starting Five
// - roster.html shows every project
//
// status: 'Live', 'Finished', 'In progress' or 'In planning'
// use "plan" for something not built yet, "solution" for something finished
// images: put the pictures in assets/projects/ and list the paths, like ['assets/projects/gym-1.webp', 'assets/projects/gym-2.webp']
//   the first one is the big picture, the rest show as small thumbnails you can click
//   while the list is empty the site shows image placeholders
// links look like { label: 'Live site', url: 'https://...' }

window.PROJECTS = [
  {
    number: '01',
    title: 'Laced',
    kind: 'Gym Management System',
    status: 'In progress',
    featured: true,
    summary: 'A records and finance system for a real gym that still runs its memberships on paper.',
    problem: 'The gym runs its monthly and annual memberships on handwritten log-ins and paper cards, so the owner has a hard time tracking the finances.',
    plan: 'Organize member and membership records and give the owner a clear finance view. Entry stays manual, because that is how the owner wants it.',
    role: 'Full stack, solo project',
    stack: ['HTML', 'CSS', 'React'],
    images: [],   // only real images of the project, no mockups
    imageAlt: '',
    links: []     // TODO: add the repo once it's up
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
    kind: 'Legal Codex API & Explorer',
    status: 'Finished',
    featured: true,
    summary: 'A central backend and explorer website for Philippine Republic Acts. It holds the laws in one database and serves them to other sites.',
    problem: 'Two other sites, JurisCard and JustGiveupATP, needed the same set of Philippine laws, so they needed one shared source instead of their own copies.',
    solution: 'A Python API on Vercel backed by Neon PostgreSQL, plus a website to read and search laws and see penalty breakdowns. Guests see the first 10 laws, logged-in users see all of them and can add notes, and admins add or edit laws without redeploying.',
    role: 'Full stack, solo project',
    stack: ['HTML', 'CSS', 'JavaScript', 'Python', 'Neon'],
    images: [],
    imageAlt: '',
    links: [
      { label: 'Live site', url: 'https://l-lawliet-three.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/zleww/L-Lawliet' }
    ]
  }

  // TODO: add the others
  // copy a block above to add the next project
];
