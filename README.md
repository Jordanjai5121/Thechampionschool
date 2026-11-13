# The Champions Matriculation Hr. Sec. School — Official Website

This repository contains the complete school website project supplied in the website ZIP.

## Technology
- React 18, TypeScript, Vite
- React Router
- Tailwind CSS
- Supabase (Postgres, Auth and Storage)
- Vercel deployment configuration

## Public website
Home, About, Academics, Programmes (including programme detail pages), Sports, Campus, Gallery, Admissions, Careers and Contact.

## Admin portal
Open `/admin` after configuring Supabase and creating a staff account. The portal includes dashboard counts, admission enquiries, career applications, contact messages, programme and gallery management, announcements, job openings, and school settings.

## Run locally
```bash
npm ci
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
npm run dev
npm run build
```

The public website can render the bundled school content without Supabase credentials. Supabase-backed forms and administration require a configured project.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Create an Auth user for the school administrator.
4. Promote that user by inserting the matching Auth user ID into `public.profiles` with role `admin`. The SQL comments in the schema include the exact statement.
5. Configure the two public Vite variables in `.env.local` and in Vercel.

Never put a Supabase service-role key in frontend environment variables.

## Deploy to Vercel
Import this GitHub repository into Vercel, set the environment variables, and deploy. The included `vercel.json` configures SPA routing.

## Important content note
Verify the school's official address, phone, email, affiliation, fees, admission dates and other public claims before publishing. These details are intentionally not fabricated.
