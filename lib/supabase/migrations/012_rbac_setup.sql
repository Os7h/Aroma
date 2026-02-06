-- 1. Create Profiles Table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user',
  created_at timestamptz default now()
);

-- 2. Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 3. Trigger to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

-- Drop trigger if exists to avoid duplication errors
drop trigger if exists on_auth_user_created on auth.users;

-- Re-create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Secure the Ingredients Table
alter table public.ingredients enable row level security;

-- Drop old policies to be safe (clean slate)
drop policy if exists "Allow public read access on ingredients" on ingredients;
drop policy if exists "Allow all updates on ingredients" on ingredients;
drop policy if exists "Allow all inserts on ingredients" on ingredients;
drop policy if exists "Allow all deletes on ingredients" on ingredients;

-- Readers (Everyone)
create policy "Enable read access for all users"
  on ingredients for select
  using ( true );

-- Admin Write Access
-- Uses a subquery to check if the requesting user has 'admin' role in profiles
create policy "Enable insert for admins only"
  on ingredients for insert
  with check ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    ) 
  );

create policy "Enable update for admins only"
  on ingredients for update
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    ) 
  );

create policy "Enable delete for admins only"
  on ingredients for delete
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    ) 
  );
