create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, name text, role text not null default 'customer' check (role in ('customer','admin')), created_at timestamptz default now());
alter table public.profiles enable row level security;
create policy "profile own read" on public.profiles for select using (auth.uid()=id);
create policy "profile own update" on public.profiles for update using (auth.uid()=id);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,name) values(new.id,new.raw_user_meta_data->>'name'); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 service text not null,
 description text not null,
 address text not null,
 preferred_date date,
 status text not null default 'new' check (status in ('new','reviewing','confirmed','done','cancelled')),
 appointment_at timestamptz,
 admin_note text,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
alter table public.requests enable row level security;
create policy "request own read" on public.requests for select using (auth.uid()=user_id);
create policy "request own insert" on public.requests for insert with check (auth.uid()=user_id);
