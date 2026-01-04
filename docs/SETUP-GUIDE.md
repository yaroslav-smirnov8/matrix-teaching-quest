# GitHub Pages Portfolio Setup Guide

Complete guide to set up and customize your portfolio site on GitHub Pages.

## Quick Start

### 1. Update Configuration

Edit `_config.yml`:
```yaml
github_username: yourusername
linkedin_username: yourprofile
email: your.email@example.com
author: Your Name
```

### 2. Update Homepage

Edit `docs/index.md`:
- Replace "Your Name" with your actual name
- Update contact information
- Add your GitHub/LinkedIn URLs
- Customize the "About Me" section

### 3. Update Project Page

Edit `docs/projects/matrix-teaching-quest.md`:
- Update timeline (e.g., "3 months", "6 weeks")
- Add actual metrics if available
- Update GitHub repository URL
- Add live demo URL if available

### 4. Add Screenshots

Create `docs/assets/screenshots/` directory and add:
- `loading-scene.png` - Loading screen
- `choice-scene.png` - Choice scene
- `challenge-scene.png` - Challenge scene
- `achievement.png` - Achievement notification
- `admin-dashboard.png` - Admin dashboard
- `user-journey.png` - User journey visualization

**Recommended screenshot dimensions**: 1200x800px or 1920x1080px

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/docs`
4. Click **Save**
5. Your site will be available at: `https://yourusername.github.io/repository-name/`

## Customization

### Change Theme

Edit `_config.yml`:
```yaml
theme: jekyll-theme-cayman
```

Available themes:
- `jekyll-theme-cayman` (current)
- `jekyll-theme-minimal`
- `jekyll-theme-midnight`
- `jekyll-theme-modernist`
- `jekyll-theme-slate`
- `jekyll-theme-tactile`
- `jekyll-theme-time-machine`

### Customize Colors

Edit `docs/assets/css/custom.css`:
```css
/* Primary color */
h1, h2 {
    border-bottom-color: #159957; /* Change this */
}

/* Links */
a {
    color: #159957; /* Change this */
}
```

### Add More Projects

1. Create new file: `docs/projects/your-project.md`
2. Copy structure from `matrix-teaching-quest.md`
3. Update content
4. Add link in `docs/index.md`

### Add Blog Section

1. Create `docs/_posts/` directory
2. Add blog posts in format: `YYYY-MM-DD-title.md`
3. Add front matter:
```yaml
---
layout: post
title: "Your Post Title"
date: 2024-01-01
---
```

## Local Development

### Install Jekyll

**macOS/Linux:**
```bash
gem install bundler jekyll
```

**Windows:**
```bash
# Install Ruby first from rubyinstaller.org
gem install bundler jekyll
```

### Run Locally

1. Navigate to `docs/` directory
2. Install dependencies:
```bash
bundle install
```

3. Start server:
```bash
bundle exec jekyll serve
```

4. Open browser: `http://localhost:4000`

### Troubleshooting

**Error: "Could not locate Gemfile"**
- Make sure you're in the `docs/` directory
- Run `bundle init` if Gemfile doesn't exist

**Error: "jekyll: command not found"**
- Install Jekyll: `gem install jekyll bundler`
- Or use: `bundle exec jekyll serve`

**Port already in use:**
- Use different port: `bundle exec jekyll serve --port 4001`

## Content Guidelines

### For Hiring Managers

Your portfolio should:
- ✅ Highlight technical skills clearly
- ✅ Show problem-solving abilities
- ✅ Demonstrate production-ready code
- ✅ Include metrics and impact
- ✅ Be easy to navigate

### Writing Tips

1. **Be Specific**: Use numbers and metrics
   - ❌ "Handles many users"
   - ✅ "Handles 1000+ concurrent users"

2. **Show Impact**: Explain business value
   - ❌ "Built an API"
   - ✅ "Built async API reducing response time by 80%"

3. **Highlight Challenges**: Show problem-solving
   - Explain the problem
   - Describe your approach
   - Show the solution
   - Share what you learned

4. **Use Action Verbs**: Start sentences with verbs
   - ✅ "Designed and implemented..."
   - ✅ "Built and deployed..."
   - ✅ "Optimized and scaled..."

## SEO Optimization

### Meta Tags

Already included in `_config.yml`:
- Title
- Description
- Keywords
- Author

### Social Sharing

Add Open Graph tags in `_includes/head.html` (if needed):
```html
<meta property="og:title" content="Your Portfolio">
<meta property="og:description" content="Full-Stack Developer Portfolio">
<meta property="og:image" content="/assets/og-image.png">
```

## Analytics

### Google Analytics

1. Get tracking ID from Google Analytics
2. Uncomment in `_config.yml`:
```yaml
google_analytics: UA-XXXXXXXXX-X
```

### GitHub Pages Analytics

GitHub provides built-in analytics:
1. Go to repository Settings → Pages
2. Enable "GitHub Pages analytics"

## Deployment

### Automatic Deployment

GitHub Pages automatically deploys when you:
1. Push to `main` branch
2. Changes are in `/docs` folder
3. GitHub Pages is enabled

### Manual Deployment

1. Make changes locally
2. Test with `bundle exec jekyll serve`
3. Commit and push:
```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

### Custom Domain

1. Add `CNAME` file in `docs/`:
```
yourdomain.com
```

2. Update DNS settings:
   - Type: `CNAME`
   - Name: `www` (or `@`)
   - Value: `yourusername.github.io`

3. Update `_config.yml`:
```yaml
url: https://yourdomain.com
```

## Maintenance

### Regular Updates

- Update project metrics quarterly
- Add new projects as completed
- Keep technologies current
- Update contact information

### Performance

- Optimize images (use WebP format)
- Minimize custom CSS
- Use CDN for assets if needed
- Test on mobile devices

## Support

For issues:
1. Check Jekyll documentation: https://jekyllrb.com/docs/
2. GitHub Pages documentation: https://docs.github.com/pages
3. Jekyll themes: https://jekyllthemes.io/

## Next Steps

1. ✅ Update all personal information
2. ✅ Add screenshots
3. ✅ Customize colors and theme
4. ✅ Test locally
5. ✅ Enable GitHub Pages
6. ✅ Share your portfolio!

---

**Your portfolio is ready to showcase your work to hiring managers and recruiters!**

