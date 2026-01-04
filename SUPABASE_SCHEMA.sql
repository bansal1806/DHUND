-- DHUND PRODUCTION DATABASE SCHEMA
-- Execute this in the Supabase SQL Editor

-- 1. Enable Vector Extension (for OpenAI Intelligence Matrix)
create extension if not exists vector;

-- 2. Missing Persons Table
create table if not exists public.missing_persons (
    id bigint generated always as identity primary key,
    name text not null,
    age integer not null,
    description text,
    photo_path text,
    reported_date timestamptz not null,
    status text default 'missing',
    ai_analysis jsonb default '{}'::jsonb,
    face_encoding vector(128),
    embedding vector(1536),
    created_at timestamptz default now()
);

-- 3. Citizen Reports Table
create table if not exists public.citizen_reports (
    id bigint generated always as identity primary key,
    person_id bigint references public.missing_persons(id),
    location text,
    description text,
    reporter_phone text,
    sighting_photo text,
    verification_score float,
    report_time timestamptz not null,
    status text default 'pending',
    embedding vector(1536),
    created_at timestamptz default now()
);

-- 4. Search Results Table
create table if not exists public.search_results (
    id bigint generated always as identity primary key,
    person_id bigint references public.missing_persons(id),
    camera_id text,
    location text,
    confidence float,
    timestamp timestamptz default now(),
    match_data jsonb default '{}'::jsonb
);

-- 5. Search Status Table
create table if not exists public.search_status (
    person_id bigint primary key references public.missing_persons(id),
    status text default 'searching',
    last_updated timestamptz default now(),
    cameras_searched integer default 0,
    matches_found integer default 0
);

-- 6. Alerts Table (for Real-time broadcasting)
create table if not exists public.alerts (
    id bigint generated always as identity primary key,
    topic text,
    person_id bigint references public.missing_persons(id),
    location text,
    confidence float,
    ai_insight text,
    timestamp timestamptz default now()
);

-- 7. Semantic Search Function (pgvector similarity)
create or replace function match_missing_persons (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  name text,
  age integer,
  description text,
  similarity float,
  match_confidence text
)
language plpgsql
as $$
begin
  return query
  select
    missing_persons.id,
    missing_persons.name,
    missing_persons.age,
    missing_persons.description,
    1 - (missing_persons.embedding <=> query_embedding) as similarity,
    to_char((1 - (missing_persons.embedding <=> query_embedding)) * 100, '999.9') || '%' as match_confidence
  from missing_persons
  where 1 - (missing_persons.embedding <=> query_embedding) > match_threshold
    and status = 'missing'
  order by missing_persons.embedding <=> query_embedding
  limit match_count;
end;
$$;
