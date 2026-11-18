# Portfolio

My personal portfolio site. Basketball "free agent" theme, my colors, my number.

Plain HTML, CSS and JavaScript. No framework and no build step.

## Run it

Open `index.html` in a browser, or use the Live Server extension in VS Code.

## Structure

```
index.html            home page
roster.html           every project
404.html              page not found
css/style.css         styles, the three colorways, responsive rules
js/threads.js         animated threads background (canvas)
js/main.js            opening, scroll effects, colorways, motion switch, contact form
js/projects.js        my projects (edit this to add one)
js/certificates.js    my certificates (edit this to add one)
assets/               favicon, my photo, project and certificate images
```

## Adding things

- Project: copy a block in `js/projects.js`. `featured: true` puts it in the Starting Five on the home page. Every project shows on the roster page.
- Certificate: add a block in `js/certificates.js`.
- Photos of me: replace a "Photo coming soon" figure in the Off the Court section with an `<img>`.

## To do

- [ ] project images and case study details
- [ ] certificates
- [ ] more photos for Off the Court
- [ ] LinkedIn link
- [ ] hero video (optional)
