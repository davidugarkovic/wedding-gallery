# Deployment Guide — Wedding Gallery

## Step 1: Supabase Setup (~10 min)

1. Create an account at [supabase.com](https://supabase.com)
2. Create a new project (choose a region close to you)
3. Go to **SQL Editor** and paste the contents of `supabase-schema.sql` → Run
4. Go to **Storage** → New bucket → Name: `wedding-photos` → Toggle **Public** ON → Create
5. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Generate Admin Credentials

In your terminal:

```bash
# Generate the password hash (replace "YourPassword" with your actual password)
node -e "require('bcryptjs').hash('YourPassword', 10).then(console.log)"

# Generate the session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy both outputs — you'll need them in Step 3.

## Step 3: Deploy to Vercel (~5 min)

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. In **Environment Variables**, add all variables from `.env.example` with real values:

```
NEXT_PUBLIC_SUPABASE_URL        = (from Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (from Supabase)
SUPABASE_SERVICE_ROLE_KEY       = (from Supabase)
ADMIN_PASSWORD_HASH             = (from Step 2)
ADMIN_SESSION_SECRET            = (from Step 2)
NEXT_PUBLIC_WEDDING_NAMES       = David & Aleksandra
NEXT_PUBLIC_WEDDING_DATE        = Nedjelja, 26. april 2026.
```

4. Click **Deploy**. Vercel will give you a URL like `https://your-project.vercel.app`

## Step 4: Generate QR Code

1. Go to any free QR generator (e.g. qr-code-generator.com)
2. Enter your Vercel URL: `https://your-project.vercel.app`
3. Download as **SVG** (for print quality) or high-res PNG
4. Add to your table card design and print!

Optional: Buy a custom domain like `david-i-aleksandra.photos` (~$10/yr on Cloudflare) and connect it to Vercel for a prettier QR code.

## Step 5: Test Before the Wedding

- Open the URL on your phone → upload a test photo
- Go to `https://your-project.vercel.app/admin` → log in with your password → verify the photo appears
- Test the "Download All" button

## Day-of Notes

- The system is fully automated — no maintenance needed
- Check Supabase is active (free projects pause after 1 week of inactivity — visit the dashboard a day before)
- Share the URL or QR with your MC/coordinator in case anyone has trouble scanning

## After the Wedding

1. Log in to the admin gallery
2. Download all photos via "Preuzmi sve" (ZIP file)
3. Back up to Google Photos, iCloud, or a hard drive
4. Supabase free tier projects pause after a week — download your photos soon!
