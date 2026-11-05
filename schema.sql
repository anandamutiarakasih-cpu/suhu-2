-- ============================================================================
-- THERMO CHAMPIONS — SUPABASE MULTIPLAYER DATABASE SCHEMA
-- Mata Pelajaran: IPA Kelas VII SMP — Materi Pokok: SUHU
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLE: game_sessions (Sesi Permainan yang Dibuat Guru/Admin)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_code VARCHAR(10) UNIQUE NOT NULL,
  title VARCHAR(120) NOT NULL DEFAULT 'Sesi Thermo Champions',
  status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- 'waiting', 'started', 'paused', 'completed'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. TABLE: session_groups (Data 8 Kelompok Per Sesi)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.session_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  group_number INTEGER NOT NULL CHECK (group_number BETWEEN 1 AND 8),
  group_name VARCHAR(100) NOT NULL,
  badge VARCHAR(10) DEFAULT '👥',
  theme VARCHAR(100) DEFAULT '',
  members JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { nama, nomorAbsen }
  device_token VARCHAR(64) NOT NULL,
  score_quiz NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_memory NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_calc NUMERIC(5,2) NOT NULL DEFAULT 0,
  final_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  predicate VARCHAR(50) NOT NULL DEFAULT 'TEMPERATURE ROOKIE',
  status VARCHAR(20) NOT NULL DEFAULT 'in_lobby', -- 'in_lobby', 'playing', 'finished'
  current_stage VARCHAR(30) DEFAULT 'dashboard',
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_group_num UNIQUE (session_id, group_number)
);

-- ============================================================================
-- 4. TABLE: group_submissions (Pencegahan Jawaban & Skor Ganda)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.group_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_sessions_code ON public.game_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_groups_session ON public.session_groups(session_id);
CREATE INDEX IF NOT EXISTS idx_submissions_group ON public.group_submissions(session_id, group_number);

-- ============================================================================
-- 5. SUPABASE REALTIME REPLICATION SETUP
-- ============================================================================
-- Aktifkan Realtime untuk sinkronisasi live antarkelompok
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'game_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'session_groups'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_groups;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'group_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.group_submissions;
  END IF;
END $$;

-- Set full replica identity for realtime update payloads
ALTER TABLE public.game_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.session_groups REPLICA IDENTITY FULL;
ALTER TABLE public.group_submissions REPLICA IDENTITY FULL;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplicates
DROP POLICY IF EXISTS "Public read game_sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Public write game_sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Public update game_sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Public read session_groups" ON public.session_groups;
DROP POLICY IF EXISTS "Public insert session_groups" ON public.session_groups;
DROP POLICY IF EXISTS "Public update session_groups" ON public.session_groups;
DROP POLICY IF EXISTS "Public read group_submissions" ON public.group_submissions;
DROP POLICY IF EXISTS "Public insert group_submissions" ON public.group_submissions;

-- Policies for game_sessions (Public via publishable key)
CREATE POLICY "Public read game_sessions" ON public.game_sessions
  FOR SELECT USING (true);

CREATE POLICY "Public write game_sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update game_sessions" ON public.game_sessions
  FOR UPDATE USING (true);

-- Policies for session_groups
CREATE POLICY "Public read session_groups" ON public.session_groups
  FOR SELECT USING (true);

CREATE POLICY "Public insert session_groups" ON public.session_groups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update session_groups" ON public.session_groups
  FOR UPDATE USING (true);

-- Policies for group_submissions
CREATE POLICY "Public read group_submissions" ON public.group_submissions
  FOR SELECT USING (true);

CREATE POLICY "Public insert group_submissions" ON public.group_submissions
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 7. HELPER RPC FUNCTION: get_server_time
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_server_time()
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN NOW();
END;
$$ LANGUAGE plpgsql;
