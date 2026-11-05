-- ============================================================================
-- THERMO CHAMPIONS — SETUP MINIMAL DATABASE SUPABASE
-- Cukup salin seluruh isi file ini ke Supabase SQL Editor lalu klik RUN
-- ============================================================================

-- 1. Tabel Sesi Game
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code VARCHAR(10) UNIQUE NOT NULL,
  title VARCHAR(120) NOT NULL DEFAULT 'Sesi Thermo Champions',
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel 8 Kelompok
CREATE TABLE IF NOT EXISTS public.session_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  group_number INTEGER NOT NULL CHECK (group_number BETWEEN 1 AND 8),
  group_name VARCHAR(100) NOT NULL,
  badge VARCHAR(10) DEFAULT '👥',
  theme VARCHAR(100) DEFAULT '',
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  device_token VARCHAR(64) NOT NULL,
  score_quiz NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_memory NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_calc NUMERIC(5,2) NOT NULL DEFAULT 0,
  final_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  predicate VARCHAR(50) NOT NULL DEFAULT 'TEMPERATURE ROOKIE',
  status VARCHAR(20) NOT NULL DEFAULT 'in_lobby',
  current_stage VARCHAR(30) DEFAULT 'dashboard',
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_group_num UNIQUE (session_id, group_number)
);

-- 3. Tabel Jawaban & Skor (Cegah Jawaban Ganda)
CREATE TABLE IF NOT EXISTS public.group_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  group_number INTEGER NOT NULL CHECK (group_number BETWEEN 1 AND 8),
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('quiz', 'memory', 'calc')),
  item_id VARCHAR(50) NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned NUMERIC(5,2) NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_item_submission UNIQUE (session_id, group_number, mode, item_id)
);

-- 4. Enable Row Level Security (RLS) & Policies
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_game_sessions" ON public.game_sessions;
CREATE POLICY "allow_all_game_sessions" ON public.game_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_session_groups" ON public.session_groups;
CREATE POLICY "allow_all_session_groups" ON public.session_groups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_group_submissions" ON public.group_submissions;
CREATE POLICY "allow_all_group_submissions" ON public.group_submissions FOR ALL USING (true) WITH CHECK (true);

-- 5. Fungsi Waktu Server
CREATE OR REPLACE FUNCTION public.get_server_time()
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. Hak Akses (Grants) & Reload Cache PostgREST
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
