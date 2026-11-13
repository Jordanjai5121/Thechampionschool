-- The Champions Matriculation Hr. Sec. School — Supabase schema
-- Run this whole file once in Supabase > SQL Editor.

create extension if not exists pgcrypto;

-- ───────── Staff accounts & roles ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz default now()
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.profiles where id = auth.uid()) $$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

-- ───────── Content tables ─────────
create table if not exists public.site_settings (
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz default now()
);
create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, tagline text, theme text, summary text,
  poster_url text, hero_url text,
  points jsonb not null default '[]', objectives jsonb not null default '[]', outcomes jsonb not null default '[]',
  published boolean not null default true, sort int not null default 0, created_at timestamptz default now()
);
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  category text not null, kind text not null default 'image' check (kind in ('image','video')),
  title text not null, url text not null, poster_url text,
  published boolean not null default true, sort int not null default 0, created_at timestamptz default now()
);
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null, body text, published boolean not null default true, created_at timestamptz default now()
);
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null, department text, job_type text, location text,
  description text, requirements text, last_date date,
  published boolean not null default true, created_at timestamptz default now()
);

-- ───────── Submissions (insert only through the RPC functions below) ─────────
create sequence if not exists public.enquiry_seq start 1001;
create sequence if not exists public.application_seq start 1001;
create sequence if not exists public.contact_seq start 1001;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  parent_name text not null, student_name text not null, phone text not null, email text not null,
  class_applying text not null, academic_year text not null, message text,
  status text not null default 'new' check (status in ('new','pending','completed')),
  created_at timestamptz default now()
);
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null, job_id uuid references public.jobs(id) on delete set null, job_title text,
  name text not null, email text not null, phone text not null,
  qualification text, experience text, message text, resume_path text,
  status text not null default 'new' check (status in ('new','pending','completed')),
  created_at timestamptz default now()
);
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null, name text not null, email text, phone text, message text not null,
  status text not null default 'new' check (status in ('new','pending','completed')),
  created_at timestamptz default now()
);

create or replace function public.submit_enquiry(
  p_parent text, p_student text, p_phone text, p_email text, p_class text, p_year text, p_message text)
returns text language plpgsql security definer set search_path = public as $$
declare r text;
begin
  if coalesce(trim(p_parent),'')='' or coalesce(trim(p_student),'')='' or coalesce(trim(p_phone),'')=''
     or coalesce(trim(p_email),'')='' or coalesce(trim(p_class),'')='' or coalesce(trim(p_year),'')='' then
    raise exception 'Missing required fields';
  end if;
  if p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email'; end if;
  if length(p_phone) > 20 or length(coalesce(p_message,'')) > 2000 then raise exception 'Input too long'; end if;
  r := 'CHM-ENQ-' || to_char(now(),'YY') || '-' || lpad(nextval('enquiry_seq')::text,5,'0');
  insert into enquiries(ref,parent_name,student_name,phone,email,class_applying,academic_year,message)
  values (r,left(trim(p_parent),120),left(trim(p_student),120),trim(p_phone),lower(trim(p_email)),left(trim(p_class),40),left(trim(p_year),20),p_message);
  return r;
end $$;

create or replace function public.submit_application(
  p_job uuid, p_name text, p_email text, p_phone text, p_qualification text, p_experience text, p_message text, p_resume text)
returns text language plpgsql security definer set search_path = public as $$
declare r text; t text;
begin
  if coalesce(trim(p_name),'')='' or coalesce(trim(p_phone),'')='' or coalesce(trim(p_email),'')='' then
    raise exception 'Missing required fields';
  end if;
  if p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email'; end if;
  if p_job is not null then select title into t from jobs where id = p_job and published; end if;
  r := 'CHM-APP-' || to_char(now(),'YY') || '-' || lpad(nextval('application_seq')::text,5,'0');
  insert into job_applications(ref,job_id,job_title,name,email,phone,qualification,experience,message,resume_path)
  values (r,case when t is null then null else p_job end,coalesce(t,'General application'),left(trim(p_name),120),lower(trim(p_email)),trim(p_phone),
          left(p_qualification,200),left(p_experience,200),left(p_message,2000),p_resume);
  return r;
end $$;

create or replace function public.submit_contact(p_name text, p_email text, p_phone text, p_message text)
returns text language plpgsql security definer set search_path = public as $$
declare r text;
begin
  if coalesce(trim(p_name),'')='' or coalesce(trim(p_message),'')='' then raise exception 'Missing required fields'; end if;
  if coalesce(trim(p_email),'')='' and coalesce(trim(p_phone),'')='' then raise exception 'Provide an email or phone number'; end if;
  r := 'CHM-MSG-' || to_char(now(),'YY') || '-' || lpad(nextval('contact_seq')::text,5,'0');
  insert into contact_messages(ref,name,email,phone,message) values (r,left(trim(p_name),120),left(p_email,200),left(p_phone,20),left(p_message,2000));
  return r;
end $$;

grant execute on function public.submit_enquiry(text,text,text,text,text,text,text) to anon, authenticated;
grant execute on function public.submit_application(uuid,text,text,text,text,text,text,text) to anon, authenticated;
grant execute on function public.submit_contact(text,text,text,text) to anon, authenticated;

-- ───────── Row Level Security ─────────
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.programmes enable row level security;
alter table public.gallery_items enable row level security;
alter table public.announcements enable row level security;
alter table public.jobs enable row level security;
alter table public.enquiries enable row level security;
alter table public.job_applications enable row level security;
alter table public.contact_messages enable row level security;

create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admin manages profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "public read settings" on public.site_settings for select using (true);
create policy "staff write settings" on public.site_settings for all using (public.is_staff()) with check (public.is_staff());

create policy "public read published programmes" on public.programmes for select using (published or public.is_staff());
create policy "staff write programmes" on public.programmes for all using (public.is_staff()) with check (public.is_staff());
create policy "public read published gallery" on public.gallery_items for select using (published or public.is_staff());
create policy "staff write gallery" on public.gallery_items for all using (public.is_staff()) with check (public.is_staff());
create policy "public read published announcements" on public.announcements for select using (published or public.is_staff());
create policy "staff write announcements" on public.announcements for all using (public.is_staff()) with check (public.is_staff());
create policy "public read published jobs" on public.jobs for select using (published or public.is_staff());
create policy "staff write jobs" on public.jobs for all using (public.is_staff()) with check (public.is_staff());

-- Submissions: no public insert/select policies at all (anon can only call the RPCs above).
create policy "staff read enquiries" on public.enquiries for select using (public.is_staff());
create policy "staff update enquiries" on public.enquiries for update using (public.is_staff()) with check (public.is_staff());
create policy "admin delete enquiries" on public.enquiries for delete using (public.is_admin());
create policy "staff read applications" on public.job_applications for select using (public.is_staff());
create policy "staff update applications" on public.job_applications for update using (public.is_staff()) with check (public.is_staff());
create policy "admin delete applications" on public.job_applications for delete using (public.is_admin());
create policy "staff read messages" on public.contact_messages for select using (public.is_staff());
create policy "staff update messages" on public.contact_messages for update using (public.is_staff()) with check (public.is_staff());
create policy "admin delete messages" on public.contact_messages for delete using (public.is_admin());

-- ───────── Storage ─────────
insert into storage.buckets (id, name, public) values ('media','media',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes','resumes',false,5242880,array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "staff write media" on storage.objects for insert with check (bucket_id = 'media' and public.is_staff());
create policy "staff update media" on storage.objects for update using (bucket_id = 'media' and public.is_staff());
create policy "staff delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_staff());
create policy "anyone uploads resume" on storage.objects for insert with check (bucket_id = 'resumes');
create policy "staff read resumes" on storage.objects for select using (bucket_id = 'resumes' and public.is_staff());
create policy "admin delete resumes" on storage.objects for delete using (bucket_id = 'resumes' and public.is_admin());

-- ───────── First admin ─────────
-- 1) Supabase > Authentication > Users > Add user (email + password).
-- 2) Then run (replace the email):
--    insert into public.profiles (id, full_name, role)
--    select id, 'School Admin', 'admin' from auth.users where email = 'you@example.com';
