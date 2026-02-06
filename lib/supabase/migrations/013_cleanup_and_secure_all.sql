-- Secure Molecules
alter table public.molecules enable row level security;
drop policy if exists "Enable read access for all users" on molecules;
drop policy if exists "Enable insert for admins only" on molecules;
drop policy if exists "Enable update for admins only" on molecules;
drop policy if exists "Enable delete for admins only" on molecules;
-- Drop old policies linked to app_users if they exist implicitly or explicitly by name
-- (The errors listed 'Allow admin write access...' so we drop those)
drop policy if exists "Allow admin write access on molecules" on molecules;

create policy "Enable read access for all users" on molecules for select using (true);
create policy "Enable insert for admins only" on molecules for insert with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable update for admins only" on molecules for update using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable delete for admins only" on molecules for delete using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Secure Aroma Groups
alter table public.aroma_groups enable row level security;
drop policy if exists "Allow admin write access on aroma_groups" on aroma_groups;
create policy "Enable read access for all users" on aroma_groups for select using (true);
create policy "Enable insert for admins only" on aroma_groups for insert with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable update for admins only" on aroma_groups for update using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable delete for admins only" on aroma_groups for delete using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Secure Ingredient Molecules
alter table public.ingredient_molecules enable row level security;
drop policy if exists "Allow admin write access on ingredient_molecules" on ingredient_molecules;
create policy "Enable read access for all users" on ingredient_molecules for select using (true);
create policy "Enable insert for admins only" on ingredient_molecules for insert with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable update for admins only" on ingredient_molecules for update using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable delete for admins only" on ingredient_molecules for delete using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Secure Ingredient Group Temperature
alter table public.ingredient_group_temperature enable row level security;
drop policy if exists "Allow admin write access on ingredient_group_temperature" on ingredient_group_temperature;
create policy "Enable read access for all users" on ingredient_group_temperature for select using (true);
create policy "Enable insert for admins only" on ingredient_group_temperature for insert with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable update for admins only" on ingredient_group_temperature for update using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable delete for admins only" on ingredient_group_temperature for delete using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Secure Ingredient Taste
alter table public.ingredient_taste enable row level security;
drop policy if exists "Allow admin write access on ingredient_taste" on ingredient_taste;
create policy "Enable read access for all users" on ingredient_taste for select using (true);
create policy "Enable insert for admins only" on ingredient_taste for insert with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable update for admins only" on ingredient_taste for update using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Enable delete for admins only" on ingredient_taste for delete using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- Finally, drop the legacy table
drop table public.app_users cascade;
