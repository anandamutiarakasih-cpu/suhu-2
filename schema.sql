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

-- ============================================================================
-- 8. SERVER-SIDE ANSWER VALIDATION & SCORING FUNCTION (ANTI-CHEAT & ANTI-DUPLICATE)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.submit_group_answer(
  p_session_id UUID,
  p_group_number INT,
  p_mode TEXT,
  p_item_id TEXT,
  p_answer TEXT,
  p_device_token TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_session RECORD;
  v_group RECORD;
  v_is_correct BOOLEAN := FALSE;
  v_points NUMERIC(5,2) := 0;
  v_expected_answer TEXT := '';
  v_explanation TEXT := '';
  v_clean_ans TEXT;
  v_calc_target NUMERIC;
  v_user_num NUMERIC;
  v_quiz_score NUMERIC(5,2);
  v_mem_score NUMERIC(5,2);
  v_calc_score NUMERIC(5,2);
  v_final_score NUMERIC(5,2);
  v_total_subs INT;
  v_correct_subs INT;
  v_accuracy NUMERIC(5,2);
  v_predicate TEXT;
BEGIN
  -- 1. Check session existence and status
  SELECT * INTO v_session FROM public.game_sessions WHERE id = p_session_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sesi tidak ditemukan');
  END IF;

  IF v_session.status != 'started' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permainan belum dimulai atau sedang dijeda.');
  END IF;

  -- 2. Check group and device token
  SELECT * INTO v_group FROM public.session_groups 
  WHERE session_id = p_session_id AND group_number = p_group_number;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Kelompok tidak terdaftar pada sesi ini.');
  END IF;

  IF v_group.device_token != p_device_token THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token perangkat tidak cocok. Hanya perangkat resmi kelompok yang dapat mengirim jawaban.');
  END IF;

  -- 3. Check duplicate submission
  IF EXISTS (
    SELECT 1 FROM public.group_submissions 
    WHERE session_id = p_session_id AND group_number = p_group_number 
      AND mode = p_mode AND item_id = p_item_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'duplicate', true, 'error', 'Jawaban untuk butir soal ini sudah pernah dikirim.');
  END IF;

  -- 4. Server-Side Validation based on mode
  v_clean_ans := TRIM(p_answer);

  IF p_mode = 'quiz' THEN
    -- Mode 1: StarChamp Quiz (10 MCQs, 3.5 pts each)
    IF p_item_id = '1' THEN
      v_expected_answer := 'B';
      v_explanation := 'Suhu adalah ukuran derajat panas atau dinginnya suatu benda secara kuantitatif.';
    ELSIF p_item_id = '2' THEN
      v_expected_answer := 'C';
      v_explanation := 'Kulit hanya merasakan sensasi secara kualitatif dan subjektif tanpa angka pasti.';
    ELSIF p_item_id = '3' THEN
      v_expected_answer := 'A';
      v_explanation := 'Lekukan kapiler klinis menahan raksa agar tidak langsung turun saat diangkat.';
    ELSIF p_item_id = '4' THEN
      v_expected_answer := 'C';
      v_explanation := 'Kesetimbangan termal tercapai saat suhu termometer sama persis dengan suhu benda.';
    ELSIF p_item_id = '5' THEN
      v_expected_answer := 'B';
      v_explanation := 'Titik tetap bawah Celsius (0°C) adalah suhu titik lebur es murni pada 1 atm.';
    ELSIF p_item_id = '6' THEN
      v_expected_answer := 'C';
      v_explanation := 'Titik tetap atas Fahrenheit pada air mendidih adalah 212°F.';
    ELSIF p_item_id = '7' THEN
      v_expected_answer := 'A';
      v_explanation := 'Rentang jumlah skala Reamur antara 0°R dan 80°R adalah 80 skala.';
    ELSIF p_item_id = '8' THEN
      v_expected_answer := 'B';
      v_explanation := 'Kelvin adalah skala mutlak termodinamika di mana 0 K partikel berhenti bergerak.';
    ELSIF p_item_id = '9' THEN
      v_expected_answer := 'A';
      v_explanation := 'Rasio perbandingan 100 : 80 : 180 : 100 disederhanakan menjadi 5 : 4 : 9 : 5.';
    ELSIF p_item_id = '10' THEN
      v_expected_answer := 'B';
      v_explanation := 'Rumus: R = 4/5 * 25 = 20°R.';
    END IF;

    IF UPPER(v_clean_ans) = UPPER(v_expected_answer) THEN
      v_is_correct := TRUE;
      v_points := 3.5;
    ELSE
      v_is_correct := FALSE;
      v_points := 0;
    END IF;

  ELSIF p_mode = 'memory' THEN
    -- Mode 2: Memory Madness (10 Recall challenges, 3.0 pts each)
    IF p_item_id = '1' THEN
      v_expected_answer := '0°C';
      v_explanation := 'Titik tetap bawah termometer Celsius adalah 0°C.';
    ELSIF p_item_id = '2' THEN
      v_expected_answer := '100°C';
      v_explanation := 'Titik tetap atas termometer Celsius adalah 100°C.';
    ELSIF p_item_id = '3' THEN
      v_expected_answer := '32°F';
      v_explanation := 'Titik tetap bawah termometer Fahrenheit adalah 32°F.';
    ELSIF p_item_id = '4' THEN
      v_expected_answer := '212°F';
      v_explanation := 'Titik tetap atas termometer Fahrenheit adalah 212°F.';
    ELSIF p_item_id = '5' THEN
      v_expected_answer := '0°R';
      v_explanation := 'Titik tetap bawah termometer Reamur adalah 0°R.';
    ELSIF p_item_id = '6' THEN
      v_expected_answer := '80°R';
      v_explanation := 'Titik tetap atas termometer Reamur adalah 80°R.';
    ELSIF p_item_id = '7' THEN
      v_expected_answer := '273 K';
      v_explanation := 'Titik tetap bawah termometer Kelvin (SI) adalah 273 K.';
    ELSIF p_item_id = '8' THEN
      v_expected_answer := '373 K';
      v_explanation := 'Titik tetap atas termometer Kelvin (SI) adalah 373 K.';
    ELSIF p_item_id = '9' THEN
      v_expected_answer := 'Alat pengukur derajat suhu baku';
      v_explanation := 'Termometer adalah instrumen pengukur derajat suhu baku.';
    ELSIF p_item_id = '10' THEN
      v_expected_answer := 'Kondisi ketika suhu benda dan termometer sudah sama';
      v_explanation := 'Kesetimbangan suhu adalah saat suhu benda = termometer.';
    END IF;

    IF LOWER(v_clean_ans) = LOWER(v_expected_answer) THEN
      v_is_correct := TRUE;
      v_points := 3.0;
    ELSE
      v_is_correct := FALSE;
      v_points := 0;
    END IF;

  ELSIF p_mode = 'calc' THEN
    -- Mode 3: Number Chains (Stages 1-5)
    IF p_item_id IN ('s1', 'stage_1', 'stage_1_step_0') THEN
      v_calc_target := 86;
      v_points := 7.0;
      v_expected_answer := '86';
      v_explanation := 'F = (9/5 * 30) + 32 = 54 + 32 = 86°F';
    ELSIF p_item_id IN ('s2', 'stage_2', 'stage_2_step_0') THEN
      v_calc_target := 32;
      v_points := 7.0;
      v_expected_answer := '32';
      v_explanation := 'R = 4/5 * 40 = 32°R';
    ELSIF p_item_id IN ('s3', 'stage_3', 'stage_3_step_0') THEN
      v_calc_target := 300;
      v_points := 7.0;
      v_expected_answer := '300';
      v_explanation := 'K = 27 + 273 = 300 K';
    ELSIF p_item_id IN ('s4', 'stage_4', 'stage_4_step_0') THEN
      v_calc_target := 100;
      v_points := 7.0;
      v_expected_answer := '100';
      v_explanation := 'C = 5/9 * (212 - 32) = 100°C';
    ELSIF p_item_id IN ('s5_a', 'stage_5_a', 'stage_5_step_0') THEN
      v_calc_target := 75;
      v_points := 3.5;
      v_expected_answer := '75';
      v_explanation := 'C = 5/4 * 60 = 75°C';
    ELSIF p_item_id IN ('s5_b', 'stage_5_b', 'stage_5_step_1') THEN
      v_calc_target := 167;
      v_points := 3.5;
      v_expected_answer := '167';
      v_explanation := 'F = (9/5 * 75) + 32 = 135 + 32 = 167°F';
    END IF;

    -- Compare numeric values
    BEGIN
      v_user_num := v_clean_ans::numeric;
      IF ABS(v_user_num - v_calc_target) < 0.1 THEN
        v_is_correct := TRUE;
      ELSE
        v_is_correct := FALSE;
        v_points := 0;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_is_correct := FALSE;
      v_points := 0;
    END;
  END IF;

  -- 5. Record submission in database
  INSERT INTO public.group_submissions (
    session_id, group_number, mode, item_id, answer, is_correct, points_earned, submitted_at
  ) VALUES (
    p_session_id, p_group_number, p_mode, p_item_id, p_answer, v_is_correct, v_points, NOW()
  );

  -- 6. Recalculate group cumulative scores on server
  SELECT COALESCE(SUM(points_earned), 0) INTO v_quiz_score
  FROM public.group_submissions
  WHERE session_id = p_session_id AND group_number = p_group_number AND mode = 'quiz';

  SELECT COALESCE(SUM(points_earned), 0) INTO v_mem_score
  FROM public.group_submissions
  WHERE session_id = p_session_id AND group_number = p_group_number AND mode = 'memory';

  SELECT COALESCE(SUM(points_earned), 0) INTO v_calc_score
  FROM public.group_submissions
  WHERE session_id = p_session_id AND group_number = p_group_number AND mode = 'calc';

  v_final_score := LEAST(100.0, ROUND(v_quiz_score + v_mem_score + v_calc_score, 1));

  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct = TRUE)
  INTO v_total_subs, v_correct_subs
  FROM public.group_submissions
  WHERE session_id = p_session_id AND group_number = p_group_number;

  IF v_total_subs > 0 THEN
    v_accuracy := ROUND((v_correct_subs::numeric / v_total_subs::numeric) * 100, 1);
  ELSE
    v_accuracy := 0;
  END IF;

  IF v_final_score >= 86 THEN
    v_predicate := 'THERMO CHAMPION';
  ELSIF v_final_score >= 76 THEN
    v_predicate := 'THERMO EXPERT';
  ELSIF v_final_score >= 66 THEN
    v_predicate := 'SCIENCE CHALLENGER';
  ELSIF v_final_score >= 56 THEN
    v_predicate := 'THERMO EXPLORER';
  ELSE
    v_predicate := 'TEMPERATURE ROOKIE';
  END IF;

  -- Update session_groups row
  UPDATE public.session_groups SET
    score_quiz = v_quiz_score,
    score_memory = v_mem_score,
    score_calc = v_calc_score,
    final_score = v_final_score,
    accuracy = v_accuracy,
    predicate = v_predicate,
    last_active = NOW(),
    updated_at = NOW()
  WHERE session_id = p_session_id AND group_number = p_group_number;

  RETURN jsonb_build_object(
    'success', true,
    'is_correct', v_is_correct,
    'points_earned', v_points,
    'expected_answer', v_expected_answer,
    'explanation', v_explanation,
    'quiz_score', v_quiz_score,
    'mem_score', v_mem_score,
    'calc_score', v_calc_score,
    'final_score', v_final_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. LEADERBOARD RANKING WITH TIE-BREAKING FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_session_leaderboard(p_session_id UUID)
RETURNS TABLE (
  rank BIGINT,
  group_number INT,
  group_name VARCHAR,
  members JSONB,
  score_quiz NUMERIC,
  score_memory NUMERIC,
  score_calc NUMERIC,
  final_score NUMERIC,
  accuracy NUMERIC,
  duration_seconds INT,
  predicate VARCHAR,
  status VARCHAR,
  is_online BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DENSE_RANK() OVER (ORDER BY sg.final_score DESC, sg.duration_seconds ASC) as rank,
    sg.group_number,
    sg.group_name,
    sg.members,
    sg.score_quiz,
    sg.score_memory,
    sg.score_calc,
    sg.final_score,
    sg.accuracy,
    sg.duration_seconds,
    sg.predicate,
    sg.status,
    sg.is_online
  FROM public.session_groups sg
  WHERE sg.session_id = p_session_id
  ORDER BY rank ASC, sg.group_number ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. ROLES, GRANTS & SCHEMA CACHE RELOAD
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- Force PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
