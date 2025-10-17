# Badge System

This system generates dynamic SVG badges for displaying on web pages. The system is modular, with each badge generated independently.

## Architecture

### Badge Types

The system generates 8 different badges:

**Static Text Badges:**
- `demos` - "DEMOS" text
- `docs` - "DOCS" text
- `blog` - "BLOG" text
- `merch` - "MERCH" text

**Dynamic Social Badges:**
- `github` - GitHub stars count with icon
- `twitter` - Twitter followers count with icon
- `discord` - Discord members count with icon

**Static Interactive Badge:**
- `cloud` - Animated cloud button

### API Endpoints

All badges are accessed via individual routes:

```
GET /badges/{name}
```

Available routes:
- `/badges/demos` - Returns DEMOS text badge
- `/badges/docs` - Returns DOCS text badge
- `/badges/blog` - Returns BLOG text badge
- `/badges/merch` - Returns MERCH text badge
- `/badges/github` - Returns GitHub stars badge
- `/badges/twitter` - Returns Twitter followers badge
- `/badges/discord` - Returns Discord members badge
- `/badges/cloud` - Returns animated cloud button

Response:
- Content-Type: `image/svg+xml`
- Cache-Control: `public, max-age=60`

### Database Schema

**badges table:**
- `name` (string) - Unique badge identifier
- `svgContent` (string) - Complete SVG markup
- `lastUpdated` (number) - Timestamp of last generation

**socialCounts table:**
- `social` (string) - Platform identifier (github/twitter/discord)
- `value` (number) - Current count
- `lastUpdated` (number) - Timestamp of last update

### Badge Generation

**Static badges** are generated once (on deployment or manually):
```typescript
// Call from Convex dashboard:
generateStaticBadges()
```

**Dynamic badges** are regenerated automatically when their counts update:
- `getBrowserUseStars()` → Updates GitHub count → Regenerates GitHub badge
- `getBrowserUseFollowers()` → Updates Twitter count → Regenerates Twitter badge
- `getBrowserUseDiscordMembers()` → Updates Discord count → Regenerates Discord badge

### SVG Generators

Three pure functions in `svgGenerator.ts`:

1. **`generateTextBadge(text: string)`**
   - Creates simple text badge
   - Auto-calculated width based on text
   - Height: 48px
   - Font: Geist Mono Medium, 14px
   - Color: #A1A1AA

2. **`generateSocialBadge(platform, count)`**
   - Creates badge with icon + count
   - Platform: 'github' | 'twitter' | 'discord'
   - Auto-calculated width
   - 28px badge height in 48px container

3. **`generateCloudButton()`**
   - Returns static 88x48px animated SVG
   - Self-contained with animations

### Usage Example

```html
<!-- Individual badges -->
<img src="https://your-app.convex.site/badges/demos" alt="Demos">
<img src="https://your-app.convex.site/badges/github" alt="GitHub Stars">
<img src="https://your-app.convex.site/badges/cloud" alt="Cloud">

<!-- Or compose them into a header -->
<div class="header">
  <img src="/badges/demos">
  <img src="/badges/docs">
  <img src="/badges/blog">
  <img src="/badges/merch">
  <img src="/badges/github">
  <img src="/badges/twitter">
  <img src="/badges/discord">
  <img src="/badges/cloud">
</div>
```
