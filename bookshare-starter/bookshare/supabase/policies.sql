alter table profiles enable row level security;
alter table shelves enable row level security;
alter table books enable row level security;
alter table friends enable row level security;
alter table borrow_requests enable row level security;

-- Profiles
create policy if not exists "read own profile" on profiles for select using (id = auth.uid());
create policy if not exists "upsert own profile" on profiles for insert with check (id = auth.uid());
create policy if not exists "update own profile" on profiles for update using (id = auth.uid());
create policy if not exists "read public profiles" on profiles for select using (is_public = true or id = auth.uid());

-- Shelves (owner full)
create policy if not exists "own shelves" on shelves for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Books
create policy if not exists "own books" on books for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Friends (owner full)
create policy if not exists "own friends" on friends for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Borrow requests visibility
create policy if not exists "select related borrow reqs" on borrow_requests for select using (
  owner_id = auth.uid() or borrower_id = auth.uid()
);
-- Owner updates
create policy if not exists "owner updates" on borrow_requests for update using (owner_id = auth.uid());
-- Insert by friend (enforced again in edge fn)
create policy if not exists "borrow insert by friend" on borrow_requests for insert with check (
  borrower_id = auth.uid()
);

-- Friend read access to owner's non-private shelves
create policy if not exists "friends read public shelves" on public.books for select using (
  user_id = auth.uid()
  or exists (
    select 1 from public.friend_pairs fp
    join public.shelves s on s.user_id = books.user_id and s.id = books.shelf_id
    where fp.owner_id = books.user_id
      and fp.viewer_id = auth.uid()
      and coalesce(s.is_private, false) = false
  )
);
