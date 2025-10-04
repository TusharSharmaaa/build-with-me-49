# AI Tools List - Production Guide

## Environment Variables

Required environment variables (automatically set by Lovable Cloud):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
VITE_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB
VITE_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII
VITE_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/RRRRRRRRRR
```

## Data Seeding

### CSV Import Template

Use this CSV structure to seed AI tools:

```csv
name,slug,description,category,profession_tags,modalities,use_cases,features,free_tier,free_limit,free_requires_login,has_watermark,pricing_model,pricing_note,pros,cons,tips,quickstart,website_url,logo_url,verified,editors_pick
ChatGPT,chatgpt,"Conversational AI assistant",Chat,"['developer','writer','analyst']","['text']","['content writing','code debugging','research']","['natural language','multi-turn','context aware']",true,"20 messages/3 hours",true,false,freemium,"Free: 20 msgs/3h. Plus $20/mo for GPT-4","['versatile','fast response']","['rate limited','occasional errors']","['be specific','break complex tasks']","['sign up','start chat','type prompt']",https://chat.openai.com,https://logo-url,true,true
```

### Quick Seed Script

```sql
-- Example: Insert a curated tool
INSERT INTO public.ai_tools (
  name, slug, description, category, profession_tags,
  modalities, use_cases, features,
  free_tier, free_limit, free_requires_login,
  pricing_model, pricing_note,
  pros, cons, tips, quickstart,
  website_url, logo_url, verified, editors_pick
) VALUES (
  'Perplexity AI',
  'perplexity-ai',
  'AI-powered search engine with citations',
  'Search',
  ARRAY['analyst', 'researcher', 'student'],
  ARRAY['text'],
  ARRAY['research', 'fact-checking', 'summarization'],
  ARRAY['real-time search', 'citations', 'follow-up questions'],
  true,
  '5 Pro searches/day',
  false,
  'freemium',
  'Free: 5 Pro searches/day. Pro $20/mo unlimited',
  ARRAY['accurate citations', 'fast results', 'no ads on free'],
  ARRAY['limited free searches', 'occasional hallucinations'],
  ARRAY['ask specific questions', 'verify critical info', 'use for research phase'],
  ARRAY['visit perplexity.ai', 'type question', 'review sources', 'ask follow-ups'],
  'https://www.perplexity.ai',
  'https://logo-url.com/perplexity.png',
  true,
  true
);
```

## PWA Build & Testing

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Android Build (Capacitor)

See `ANDROID_BUILD_GUIDE.md` for complete instructions.

Quick steps:
```bash
npm run build
npx cap sync android
npx cap open android
# Build signed AAB in Android Studio
```

## AdMob Setup

### Test Mode (Development)
- Uses Google's test ad IDs automatically
- Toggle in Settings → "Use test ads"

### Production Mode
1. Create ad units in AdMob console
2. Add production IDs to Supabase secrets:
   - `ADMOB_APP_ID`
   - `ADMOB_BANNER_ID`
   - `ADMOB_INTERSTITIAL_ID`
   - `ADMOB_REWARDED_ID`
3. Implement UMP consent (see ANDROID_BUILD_GUIDE.md)
4. Toggle off "Use test ads" in Settings

### Ad Frequency Configuration

Edit `remote_config` table in Supabase:

```sql
UPDATE public.remote_config
SET config_value = jsonb_set(
  config_value,
  '{ads}',
  '{
    "bannersEnabled": true,
    "interstitialEnabled": true,
    "rewardedEnabled": true,
    "interstitialEveryNDetails": 2,
    "interstitialMinSeconds": 120,
    "rewardedEveryNSearches": 10,
    "rewardedMinSeconds": 300
  }'::jsonb
)
WHERE config_key = 'ads_config';
```

Changes apply immediately without redeploying.

## Feature Toggles

Update `remote_config.ui` to enable/disable features:

```sql
UPDATE public.remote_config
SET config_value = jsonb_set(
  config_value,
  '{ui}',
  '{
    "showTrending": true,
    "showEditorsPicks": true,
    "showCollections": true,
    "showWorkflows": true
  }'::jsonb
)
WHERE config_key = 'ads_config';
```

## Content Management

### Mark Tool as Featured
```sql
UPDATE public.ai_tools
SET featured = true, featured_order = 1
WHERE slug = 'chatgpt';
```

### Mark Tool as Editor's Pick
```sql
UPDATE public.ai_tools
SET editors_pick = true, verified = true, last_verified_at = now()
WHERE slug = 'perplexity-ai';
```

### Create a Collection
```sql
-- Insert collection
INSERT INTO public.collections (name, slug, description)
VALUES ('Best Free Tools 2025', 'best-free-2025', 'Top free AI tools curated for 2025');

-- Add tools to collection
INSERT INTO public.collection_items (collection_id, tool_id, rank)
SELECT 
  (SELECT id FROM public.collections WHERE slug = 'best-free-2025'),
  id,
  ROW_NUMBER() OVER (ORDER BY rating DESC)
FROM public.ai_tools
WHERE free_tier = true AND rating >= 4.5
LIMIT 10;
```

### Create a Workflow
```sql
INSERT INTO public.workflows (name, slug, description, professions, steps)
VALUES (
  'Content Creation Pipeline',
  'content-pipeline',
  'From idea to published content',
  ARRAY['writer', 'marketer'],
  '[
    {"title": "Generate ideas", "text": "Brainstorm with ChatGPT", "tip": "Ask for 10 variations"},
    {"title": "Write draft", "text": "Expand best idea with Jasper", "tip": "Use SEO keywords"},
    {"title": "Create visuals", "text": "Generate images with DALL-E", "tip": "Be specific with prompts"},
    {"title": "Publish", "text": "Format and post", "tip": "Add meta descriptions"}
  ]'::jsonb
);
```

## Analytics & Monitoring

### View Usage Stats
```sql
SELECT 
  t.name,
  SUM(u.opens) as total_opens,
  COUNT(DISTINCT u.user_id) as unique_users
FROM public.track_usage u
JOIN public.ai_tools t ON t.id = u.tool_id
GROUP BY t.name
ORDER BY total_opens DESC
LIMIT 20;
```

### Popular Searches
```sql
-- Track in analytics_events table (create if needed)
SELECT event_properties->>'query' as search_query, COUNT(*) as count
FROM analytics_events
WHERE event_name = 'search_query'
GROUP BY search_query
ORDER BY count DESC
LIMIT 20;
```

## Performance Optimization

- **Image optimization**: All logos use WebP with fallback
- **Code splitting**: Routes lazy-loaded, initial bundle ~180KB
- **Caching**: Service Worker caches app shell + last 50 tools
- **Network resilience**: 10s timeout, 2 retries with exponential backoff
- **List virtualization**: 12 items per page with infinite scroll

## Security Checklist

- [x] RLS policies enabled on all tables
- [x] User data isolated via user_id checks
- [x] No API keys in frontend code
- [x] Input validation on all forms
- [x] HTTPS enforced (automatic on Lovable deploy)
- [x] Content Security Policy headers
- [x] Safe external links (rel="noopener noreferrer")

## Deployment

### Lovable Hosting
1. Click "Publish" in Lovable editor
2. App deployed to: `https://preview--ai-tools-2026.lovable.app`
3. Auto-SSL, CDN, and global edge distribution

### Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., aitoolslist.com)
3. Configure DNS records as shown
4. SSL auto-provisioned

### Play Store
1. Build signed AAB (see ANDROID_BUILD_GUIDE.md)
2. Upload to Play Console
3. Complete store listing with:
   - Screenshots (phone + tablet)
   - Feature graphic (1024x500)
   - Short description (<80 chars)
   - Full description (<4000 chars)
   - Privacy Policy URL
   - Content rating
4. Submit for review

## Maintenance

### Weekly Tasks
- [ ] Review pending tool submissions
- [ ] Verify tool information accuracy
- [ ] Update featured tool
- [ ] Check for broken links

### Monthly Tasks
- [ ] Add new curated collections
- [ ] Create new workflows
- [ ] Analyze top search queries
- [ ] Update app with new tools

## Support

For technical issues or questions:
- GitHub Issues: [repo-url]
- Email: support@aitoolslist.app
- Lovable Docs: https://docs.lovable.dev
