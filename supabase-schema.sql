-- Run this in the Supabase SQL Editor (supabase.com > your project > SQL Editor)

create table photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text not null,
  uploader_name text,
  uploader_ip text,
  uploaded_at timestamptz default now(),
  file_size_bytes integer
);

alter table photos enable row level security;

-- Allow guests to insert (upload) without authentication
create policy "Anyone can insert photos"
  on photos for insert
  with check (true);

-- Allow anyone to select (needed for admin gallery fetched via service role)
create policy "Anyone can select photos"
  on photos for select
  using (true);

-- Allow anyone to delete (protected at API level via admin cookie)
create policy "Anyone can delete photos"
  on photos for delete
  using (true);
