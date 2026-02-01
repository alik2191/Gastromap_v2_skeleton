# 🗄 GastroMap V2: Схема Базы Данных (Simplified)

В новой версии мы используем минималистичную, но расширяемую схему. Убираем лишние связи и таблицы, фокусируемся на основной функциональности.

## 1. Таблицы

### `public.profiles`
Расширение для стандартной таблицы `auth.users`, управляемой Supabase.
*   `id` (uuid, PK) — References `auth.users.id` (ON DELETE CASCADE)
*   `role` (text) — 'user', 'moderator', 'admin'. Default: 'user'
*   `full_name` (text)
*   `avatar_url` (text)
*   `created_at` (timestamptz)

### `public.locations`
Основная сущность приложения.
*   `id` (uuid, PK) — Default: `gen_random_uuid()`
*   `title` (text) — Название заведения
*   `description` (text) — Описание
*   `category` (text) — 'cafe', 'restaurant', 'bar', etc.
*   `address` (text) — Текстовый адрес
*   `coordinates` (jsonb) — `{"lat": 50.0, "lng": 19.9}`
*   `images` (text[]) — Массив ссылок на фото
*   `website` (text)
*   `phone` (text)
*   `status` (text) — 'pending' (на модерации), 'published' (опубликовано), 'rejected' (отклонено). Default: 'pending'
*   `created_by` (uuid) — References `profiles.id`
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

### `public.reviews`
Отзывы пользователей к локациям.
*   `id` (uuid, PK)
*   `location_id` (uuid) — References `locations.id` (ON DELETE CASCADE)
*   `user_id` (uuid) — References `profiles.id`
*   `rating` (integer) — 1-5
*   `comment` (text)
*   `status` (text) — 'published', 'hidden'. Default: 'published'
*   `created_at` (timestamptz)

---

## 2. Row Level Security (RLS) Policies

Безопасность на уровне строк — критически важна.

### Profiles
*   `SELECT`: Public (все могут просматривать базовые профили - имя/аватар).
*   `UPDATE`: Users can update their own profile (`auth.uid() = id`).
*   `INSERT`: Trigger on auth.users creation (автоматически).

### Locations
*   `SELECT (Public)`: `status = 'published'`. Все видят опубликованные локации.
*   `SELECT (Owner)`: `auth.uid() = created_by`. Создатель видит свои (даже pending).
*   `SELECT (Admin)`: `auth.jwt() ->> 'role' = 'admin'`. Админ видит всё.
*   `INSERT`: Authenticated users.
*   `UPDATE (Owner)`: `auth.uid() = created_by`.
*   `UPDATE (Admin)`: Full access.
*   `DELETE (Admin)`: Only admins.

### Reviews
*   `SELECT`: Public (`status = 'published'`).
*   `INSERT`: Authenticated users.
*   `UPDATE (Owner)`: Users can edit their own reviews.

---

## 3. Storage Buckets

*   `locations` (Public): Фотографии заведений.
*   `avatars` (Public): Аватары пользователей.

---

## 4. SQL Init Script (Пример для Supabase SQL Editor)

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text default 'user',
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: anyone can view profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Policy: users can update own profile
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Trigger for new user handling
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create locations table
create table public.locations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  description text,
  address text,
  coordinates jsonb,
  images text[],
  category text,
  status text default 'pending',
  created_by uuid references public.profiles(id)
);

-- Enable RLS
alter table public.locations enable row level security;
```
