# Admin Quick Start Guide

## 🚀 How to Become an Admin

### Step 1: Get Your User ID
1. Sign up or log in to the app
2. Note your email address

### Step 2: Grant Admin Role
Open the Lovable backend and run this SQL:

```sql
-- Find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Grant admin role (replace 'your-user-id' with the ID from above)
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

### Step 3: Verify Access
1. Log out of the app
2. Log back in
3. Go to Profile → You should see "Admin Dashboard" button
4. Click it to access `/admin`

---

## 📊 Admin Dashboard Overview

### Submissions Tab
**Purpose:** Review and approve tool submissions from users

**Actions:**
- ✅ **Approve** - Mark submission as approved
- ❌ **Reject** - Mark submission as rejected
- 👀 **View Details** - See full submission info

**Workflow:**
1. User submits tool via `/submit`
2. Tool appears in "Submissions" tab with status: Pending
3. Admin reviews and approves/rejects
4. Approved tools can be manually added to database

**Manual Tool Addition (After Approval):**
```sql
INSERT INTO ai_tools (
  name, description, category, profession_tags, 
  free_tier, free_limit, pricing_note, website_url
) VALUES (
  'Tool Name',
  'Tool description',
  'Category',
  ARRAY['profession-slug-1', 'profession-slug-2'],
  true,
  '100 requests/month',
  'Free tier available. Pro: $20/month',
  'https://tool-website.com'
);
```

---

### Notifications Tab
**Purpose:** Send push notifications to all users

**Fields:**
- **Title:** Notification headline (max 100 chars)
- **Message:** Notification body (max 500 chars)
- **URL (optional):** Where to redirect users when clicked

**Example Notifications:**

**New Tools Announcement:**
```
Title: 🎉 10 New AI Tools Added!
Message: We've added 10 new AI tools for developers and designers. Check them out now!
URL: /categories
```

**Weekly Update:**
```
Title: Weekly AI Tools Update
Message: This week's top picks: ChatGPT, Midjourney, and GitHub Copilot. See what's trending!
URL: /
```

**Category Spotlight:**
```
Title: Tools for Lawyers 👨‍⚖️
Message: New AI tools for legal professionals. Automate contracts, research, and more.
URL: /category/lawyer
```

---

### Featured Tools Tab
**Purpose:** Manage premium/featured tools

**Current Status:** Manual database updates required

**How to Feature a Tool:**
```sql
-- Feature a specific tool
UPDATE ai_tools 
SET featured = true, featured_order = 1 
WHERE name = 'ChatGPT';

-- Feature top 10 tools by rating
UPDATE ai_tools 
SET featured = true, 
    featured_order = ROW_NUMBER() OVER (ORDER BY rating DESC)
WHERE rating >= 4.8
LIMIT 10;

-- Unfeature a tool
UPDATE ai_tools 
SET featured = false 
WHERE name = 'Tool Name';
```

**Featured Order:**
- Lower numbers appear first
- Use 1, 2, 3... for manual ordering
- Users unlock via rewarded video ad on `/premium`

---

## 🔔 Automating Weekly Notifications

### Option 1: Manual (Current)
Every Monday:
1. Go to `/admin` → Notifications tab
2. Write notification about new tools
3. Click "Send Notification"

### Option 2: Automated Cron Job (Advanced)
Set up Supabase Cron Job:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule weekly notification (every Monday at 9 AM)
SELECT cron.schedule(
  'weekly-new-tools-notification',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://swsjtzzinexxaainjnww.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.anon_key')
    ),
    body := jsonb_build_object(
      'title', 'New AI Tools This Week!',
      'body', 'Check out the latest AI tools added this week.',
      'url', '/'
    )
  );
  $$
);

-- View scheduled jobs
SELECT * FROM cron.job;

-- Delete a scheduled job
SELECT cron.unschedule('weekly-new-tools-notification');
```

---

## 🛠️ Common Admin Tasks

### Add a New Tool Manually
```sql
INSERT INTO ai_tools (
  name, 
  description, 
  category, 
  profession_tags,
  free_tier, 
  free_limit, 
  pricing_note, 
  website_url,
  rating
) VALUES (
  'New AI Tool',
  'Description of what this tool does',
  'Development',
  ARRAY['software-developer', 'data-analyst'],
  true,
  '1000 API calls/month',
  'Free tier available. Pro: $29/month',
  'https://example.com',
  4.5
);
```

### Update Tool Information
```sql
UPDATE ai_tools
SET 
  description = 'Updated description',
  pricing_note = 'New pricing: Free tier, Pro $19/month',
  rating = 4.8
WHERE name = 'Tool Name';
```

### Add a New Profession Category
```sql
INSERT INTO professions (name, slug, icon_url)
VALUES ('Project Manager', 'project-manager', null);
```

### View Pending Submissions
```sql
SELECT 
  tool_name, 
  category, 
  description, 
  status, 
  created_at
FROM submissions
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Approve All Pending Submissions
```sql
UPDATE submissions
SET status = 'approved'
WHERE status = 'pending';
```

---

## 📈 Analytics Queries

### Most Popular Tools (by favorites)
```sql
SELECT 
  t.name,
  COUNT(f.id) as favorite_count
FROM ai_tools t
LEFT JOIN favorites f ON t.id = f.tool_id
GROUP BY t.id, t.name
ORDER BY favorite_count DESC
LIMIT 10;
```

### Most Active Categories
```sql
SELECT 
  category,
  COUNT(*) as tool_count,
  AVG(rating) as avg_rating
FROM ai_tools
GROUP BY category
ORDER BY tool_count DESC;
```

### Recent User Signups
```sql
SELECT 
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;
```

### Submission Stats
```sql
SELECT 
  status,
  COUNT(*) as count
FROM submissions
GROUP BY status;
```

---

## 🔒 Security Best Practices

### Admin Access
- ✅ Never share admin credentials
- ✅ Only grant admin role to trusted users
- ✅ Use strong passwords for admin accounts
- ✅ Regularly review admin actions in logs

### User Roles
```sql
-- View all admins
SELECT u.email, ur.role, ur.created_at
FROM user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- Remove admin role
DELETE FROM user_roles
WHERE user_id = 'user-id-here' AND role = 'admin';

-- Add moderator role (for future use)
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-here', 'moderator');
```

---

## 🚨 Emergency Procedures

### Remove Inappropriate Content
```sql
-- Delete a tool
DELETE FROM ai_tools WHERE id = 'tool-id-here';

-- Delete a submission
DELETE FROM submissions WHERE id = 'submission-id-here';

-- Delete a review
DELETE FROM reviews WHERE id = 'review-id-here';
```

### Ban a User
```sql
-- This will be implemented in future admin features
-- For now, contact Supabase support to ban a user
```

---

## 📞 Support

### Need Help?
- Check `PHASE_7_SUMMARY.md` for detailed documentation
- Review `DEPLOYMENT_GUIDE.md` for technical setup
- Post in Lovable Discord for community support

### Report Issues
- Use GitHub Issues (if repo is public)
- Email: your-support-email@example.com
- Admin dashboard feedback section (coming soon)

---

## ✅ Admin Checklist

### Daily (5 min)
- [ ] Check pending submissions
- [ ] Review flagged reviews/content
- [ ] Monitor error logs

### Weekly (30 min)
- [ ] Approve/reject submissions
- [ ] Send push notification
- [ ] Update featured tools
- [ ] Review analytics

### Monthly (2 hrs)
- [ ] Analyze growth metrics
- [ ] Add new categories
- [ ] Research new tools
- [ ] Update SEO
- [ ] Optimize ad revenue

---

**Remember:** With great power comes great responsibility! 🦸‍♂️

Use admin tools to improve the user experience and grow the community.

Happy administrating! 🎉
