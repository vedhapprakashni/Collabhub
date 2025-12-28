-- CollabHub Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  bio text,
  skills text[],
  github_url text,
  linkedin_url text,
  created_at timestamp default now()
);

-- 3. Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  tech_stack text[],
  looking_for text[], -- ex: frontend, backend, designer
  is_open boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 4. Collaboration requests table
create table if not exists collaboration_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  requester_id uuid references profiles(id) on delete cascade,
  message text,
  status text default 'pending', -- pending | accepted | rejected
  created_at timestamp default now(),
  unique(project_id, requester_id) -- Prevent duplicate requests
);

-- 5. Team members table
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text,
  joined_at timestamp default now(),
  unique(project_id, user_id) -- Prevent duplicate memberships
);

-- 6. Create indexes for better performance
create index if not exists idx_projects_owner_id on projects(owner_id);
create index if not exists idx_projects_is_open on projects(is_open);
create index if not exists idx_collaboration_requests_project_id on collaboration_requests(project_id);
create index if not exists idx_collaboration_requests_requester_id on collaboration_requests(requester_id);
create index if not exists idx_team_members_project_id on team_members(project_id);
create index if not exists idx_team_members_user_id on team_members(user_id);

-- 7. Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 8. Trigger to call the function on user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table projects enable row level security;
alter table collaboration_requests enable row level security;
alter table team_members enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Anyone can view open projects"
  on projects for select
  using (is_open = true or owner_id = auth.uid());

create policy "Users can create their own projects"
  on projects for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = owner_id);

-- Collaboration requests policies
create policy "Users can view requests for their projects"
  on collaboration_requests for select
  using (
    requester_id = auth.uid() or
    exists (
      select 1 from projects
      where projects.id = collaboration_requests.project_id
      and projects.owner_id = auth.uid()
    )
  );

create policy "Users can create collaboration requests"
  on collaboration_requests for insert
  with check (auth.uid() = requester_id);

create policy "Project owners can update requests"
  on collaboration_requests for update
  using (
    exists (
      select 1 from projects
      where projects.id = collaboration_requests.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Team members policies
create policy "Users can view team members of projects they're part of"
  on team_members for select
  using (
    user_id = auth.uid() or
    exists (
      select 1 from projects
      where projects.id = team_members.project_id
      and (projects.owner_id = auth.uid() or projects.id in (
        select project_id from team_members where user_id = auth.uid()
      ))
    )
  );

create policy "Project owners can add team members"
  on team_members for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = team_members.project_id
      and projects.owner_id = auth.uid()
    )
  );

