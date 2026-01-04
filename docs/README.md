# Portfolio Site - GitHub Pages

This is a professional portfolio site built with Jekyll and GitHub Pages, showcasing full-stack development projects.

## Structure

```
docs/
├── _config.yml          # Jekyll configuration
├── index.md             # Homepage
├── projects/
│   └── matrix-teaching-quest.md  # Project detail page
├── assets/
│   └── css/
│       └── custom.css   # Custom styles
└── README.md            # This file
```

## Setup

1. Update `_config.yml` with your information:
   - GitHub username
   - LinkedIn profile
   - Email address
   - Author name

2. Update `index.md` with your personal information:
   - About me section
   - Contact information
   - Project links

3. Add screenshots to `assets/screenshots/`:
   - loading-scene.png
   - choice-scene.png
   - challenge-scene.png
   - achievement.png
   - admin-dashboard.png
   - user-journey.png

4. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Select source: `main` branch, `/docs` folder
   - Your site will be available at `https://yourusername.github.io/repository-name/`

## Customization

### Colors
Edit `assets/css/custom.css` to change the color scheme.

### Content
All content is in Markdown files. Edit:
- `index.md` for homepage content
- `projects/matrix-teaching-quest.md` for project details

### Theme
The site uses the Cayman theme. You can change it in `_config.yml`:
```yaml
theme: jekyll-theme-cayman
```

Available themes:
- jekyll-theme-cayman
- jekyll-theme-minimal
- jekyll-theme-midnight
- jekyll-theme-modernist
- jekyll-theme-slate
- jekyll-theme-tactile
- jekyll-theme-time-machine

## Local Development

1. Install Jekyll:
```bash
gem install bundler jekyll
```

2. Install dependencies:
```bash
bundle install
```

3. Run local server:
```bash
bundle exec jekyll serve
```

4. View at `http://localhost:4000`

## Deployment

The site automatically deploys when you push to the main branch (if GitHub Pages is enabled).

Manual deployment:
1. Push changes to `main` branch
2. GitHub Pages will rebuild automatically
3. Changes appear within a few minutes

## License

This portfolio template is free to use and modify for your own portfolio.
