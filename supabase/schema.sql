create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  display_name text,
  username text unique,
  is_public boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.shelves (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  is_private boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.books (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  isbn text not null,
  title text not null,
  authors text[] null,
  cover_url text null,
  shelf_id uuid null references public.shelves(id) on delete set null,
  position int null,
  notes text null,
  created_at timestamptz default now()
);

create table if not exists public.friends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null default auth.uid(),
  friend_user_id uuid references auth.users on delete cascade not null,
  status text not null default 'pending',
  created_at timestamptz default now(),
  unique(user_id, friend_user_id)
);

create table if not exists public.borrow_requests (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users on delete cascade not null,
  borrower_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- views
create or replace view public.friends_view as
select f.id, f.user_id, f.friend_user_id, f.status,
  p.email as friend_email, p.display_name as friend_name
from friends f
join profiles p on p.id = f.friend_user_id
where f.user_id = auth.uid();

create or replace view public.borrow_requests_view as
select br.id, br.owner_id, br.borrower_id, br.book_id, br.status, br.created_at,
  (select email from profiles where id=br.borrower_id) as borrower_email,
  (select email from profiles where id=br.owner_id) as owner_email,
  (select title from books where id=br.book_id) as book_title
from borrow_requests br
where br.owner_id = auth.uid() or br.borrower_id = auth.uid();

create or replace view public.friend_pairs as
select a.user_id as owner_id, a.friend_user_id as viewer_id
from public.friends a
where a.status = 'accepted'
union
select b.friend_user_id as owner_id, b.user_id as viewer_id
from public.friends b
where b.status = 'accepted';

-- mirror acceptance trigger
create or replace function public.mirror_friend_accept() returns trigger as $$
begin
  if (TG_OP = 'UPDATE' and NEW.status = 'accepted') then
    insert into public.friends(user_id, friend_user_id, status)
    select NEW.friend_user_id, NEW.user_id, 'accepted'
    where not exists (
      select 1 from public.friends where user_id = NEW.friend_user_id and friend_user_id = NEW.user_id
    );
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_mirror_friend_accept on public.friends;
create trigger trg_mirror_friend_accept
after update on public.friends
for each row execute function public.mirror_friend_accept();
