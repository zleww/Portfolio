// Starting Five data. main.js builds the cards from this list,
// so adding a project = editing one entry here.
//
// the first entry is the big featured card
// status: 'Live', 'In planning' or 'On the bench'
// use "plan" for something not built yet, "solution" for something finished
// links look like { label: 'GitHub', url: 'https://...' }

window.PROJECTS = [
  {
    number: '01',
    title: 'Gym Management System',
    status: 'In planning',
    problem: 'A real gym runs its monthly and annual memberships on handwritten log-ins and paper cards, so the finances are hard to track.',
    plan: 'Organize member and membership records and give the owner a clear finance view. Entry stays manual by choice.',
    stack: [], // not decided yet
    links: []
  },
  {
    number: '02',
    status: 'On the bench',
    note: 'Next project is in the works.'
  },
  {
    number: '03',
    status: 'On the bench',
    note: 'Roster spot open.'
  },
  {
    number: '04',
    status: 'On the bench',
    note: 'Roster spot open.'
  },
  {
    number: '05',
    status: 'On the bench',
    note: 'Roster spot open.'
  }
];
