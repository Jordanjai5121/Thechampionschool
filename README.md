# The Champions Matriculation Hr. Sec. School — Official Website

React + Vite + TypeScript + Tailwind + React Router + Supabase (Postgres, Auth, Storage). Deploys to Vercel.

## 1. Run locally
```bash
npm install
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local
npm run dev
npm run build
```

This project ZIP includes a local `.env.local` configured for the Supabase project supplied by the owner. `.env.local` is ignored by Git and must not be committed. For GitHub/Vercel deployments, add the same two values in the hosting provider's environment-variable settings.

The `sb_publishable_...` key is a public browser key. It is designed to be exposed in client-side applications; access is controlled by Supabase Row Level Security and database permissions. Never put a `service_role` or secret key in a `VITE_` variable or frontend source.

Without Supabase environment variables, the public site falls back to built-in school content; forms and admin login remain disabled.

## 2. Set up Supabase (once)
1. Open the Supabase project configured in `.env.local`.
2. In **SQL Editor**, paste and run `supabase/schema.sql`. This creates the tables, Row Level Security policies, submission RPC functions and storage buckets used by the site.
3. In **Authentication → Users**, add the school administrator's email and password.
4. Run this in SQL Editor, replacing the email with the administrator's email:
   ```sql
   insert into public.profiles (id, full_name, role)
   select id, 'School Admin', 'admin'
   from auth.users
   where email = 'YOUR@EMAIL';
   ```
   Add staff with role `'editor'` as needed. Editors manage content; only admins can delete submissions.
5. Confirm the Storage buckets `media` and `resumes` exist after running the schema.

## 3. First login
Open `/admin` and sign in, then:
- **Programmes** and **Gallery & videos**: click *Import default content* once so the supplied programmes, photos and videos become editable.
- **School information**: add the verified address, phone, email, Google Maps link, admissions details and academics. Empty fields stay hidden on the public site.
- Turn on **Admissions are open** when ready.

## 4. Deploy
Push the project to GitHub and import the repository into Vercel. Add these environment variables in Vercel for **Production**, **Preview** and **Development** as required:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Redeploy after setting or changing environment variables. `vercel.json` handles page routing. Replace `YOUR-DOMAIN` in `public/sitemap.xml` and `public/robots.txt` before launch.

## What is included
- Public: Home, About (+ Chairman and CEO messages), Academics, 6 programme pages, Sports, Campus, Gallery (filters + lightbox + video), Admissions (enquiry form, reference number), Careers portal (openings + application with resume upload), Contact.
- Admin (`/admin`): dashboard counts, admission enquiries / career applications / contact messages with status changes and CSV export, programmes, gallery and video uploads, announcements, job openings, school/leadership/contact/admissions info, publish/unpublish.
- Security: submissions go through `security definer` functions (anonymous visitors cannot read submitted records); resumes are stored in a private bucket; staff-only writes are enforced by RLS.

## Important before publishing
Verify the school's official address, phone, email, affiliation, fees, admission dates and other public claims. These details should be confirmed by the school before the website goes live.

## Not included (needs a separate setup)
Admin email notifications for new enquiries require a Supabase Database Webhook or Edge Function plus an email provider.
