# Frangel Florendo | Portfolio

Personal portfolio built with plain HTML, CSS, and JavaScript. No frameworks, no build step, works on GitHub Pages as is.

## Folder layout

```
index.html
style.css
asset/
  js/script.js
  image/
    favicon.jfif
    profile.png        <- optional headshot (initials show if missing)
    project-1.png      <- project screenshots, project-1 to project-6
    cert-1.png         <- optional certification badges, cert-1 to cert-3
```

## Before going live

1. **Project screenshots.** Save wide screenshots (about 1600 x 900) as `asset/image/project-1.png` to `project-6.png`. They replace the "Preview coming soon" panels automatically.
2. **Project text.** In `index.html`, search for `PROJECT PLACEHOLDERS` and check each description, role, and stack against the real build.
3. **Certifications.** Search for `Certification name` and fill in the name, issuer, year, and credential link.
4. **Industries.** Confirm "Automotive" and "Lead prospecting" are worded the way you want.

## Hosting on GitHub Pages

1. Upload `index.html`, `style.css`, and the `asset/` folder to your repository, replacing the old files.
2. You can delete the old files the new site doesn't use: `asset/js/jquery-3.6.0.js`, `asset/image/background1.jpg`, `asset/image/burger.png`, `asset/image/work-*.png`, `asset/image/work*.png`, and the `asset/svg/` folder.
3. In **Settings > Pages**, keep the source as your `main` branch and `/ (root)`. Your URL stays the same.

The contact form sends to Formspree (`https://formspree.io/f/mpznaoej`). Send a test message after deploying to confirm it reaches your inbox.
