# Shot List Generator

AI-powered shot list generator for filmmakers, YouTubers and directors.

## Deploy on Vercel (step by step)

### 1. Upload this code on GitHub

1. Go to your GitHub repository (e.g. `shot-list-generator`)
2. Click **Add file → Upload files**
3. Upload all files keeping the folder structure:
   - `api/generate.js`
   - `public/index.html`
   - `vercel.json`
   - `package.json`
4. Click **Commit changes**

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click **Add New → Project**
3. Select your `shot-list-generator` repository
4. Click **Deploy** (no other settings needed)

### 3. Add your Anthropic API key

1. In Vercel, go to your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key (starts with `sk-ant-...`)
3. Click **Save**
4. Go to **Deployments → Redeploy** (to apply the env variable)

### 4. Your site is live!

Vercel gives you a free URL like `shot-list-generator.vercel.app`.

## Monetization

- **Free tier:** 3 generations/day per user (tracked via localStorage)
- **Pro tier:** Add Stripe for €7/month unlimited access
- **AdSense:** Replace the `<div class="ad-slot">` placeholders with your AdSense code

## Costs

- Vercel hosting: **free**
- Anthropic API: ~$0.003 per generation (claude-sonnet)
  - 1000 free generations/month ≈ $3 in API costs
  - Break-even at ~1 Pro subscriber
