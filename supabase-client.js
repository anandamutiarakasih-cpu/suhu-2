/**
 * THERMO CHAMPIONS — SUPABASE DATA & REALTIME SERVICE
 * Handles Multi-Group Online Synchronization & Database Operations
 */

const ThermoDB = {
  
  // Cache for server time offset (in milliseconds)
  serverTimeOffsetMs: 0,

  /**
   * Measure time offset between client machine and Supabase server
   */
  async syncServerTime() {
    const client = getSupabaseClient();
    if (!client) return 0;
    try {
      const clientBefore = Date.now();
      const { data, error } = await client.rpc('get_server_time');
      const clientAfter = Date.now();
      if (!error && data) {
        const serverTime = new Date(data).getTime();
        const roundTrip = clientAfter - clientBefore;
        const estimatedServerNow = serverTime + (roundTrip / 2);
        this.serverTimeOffsetMs = estimatedServerNow - clientAfter;
        return this.serverTimeOffsetMs;
      }
    } catch (e) {
      console.warn('Could not sync with server time RPC, using client time:', e);
    }
    return 0;
  },

  /**
   * Get current synchronized server timestamp
   */
  getNow() {
    return new Date(Date.now() + this.serverTimeOffsetMs);
  },

  // ========================================================================
  // SESSION MANAGEMENT (Admin)
  // ========================================================================

  /**
   * Create a new multiplayer game session
   */
  async createSession(title = 'Sesi Turnamen Suhu 8 Kelompok', customCode = null) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client belum terhubung. Periksa Supabase URL di pengaturan.');

    const code = customCode ? customCode.trim().toUpperCase() : ('TC-' + Math.floor(1000 + Math.random() * 9000));

    const { data, error } = await client
      .from('game_sessions')
      .insert({
        session_code: code,
        title: title,
        status: 'waiting'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch session by 6-char session code
   */
  async getSessionByCode(code) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client belum terhubung.');

    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await client
      .from('game_sessions')
      .select('*')
      .eq('session_code', cleanCode)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch session by UUID
   */
  async getSessionById(sessionId) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * "MULAI BERSAMA": Admin initiates the synchronized game start for all 8 groups
   */
  async startSession(sessionId) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client belum terhubung.');

    const now = this.getNow().toISOString();
    const { data, error } = await client
      .from('game_sessions')
      .update({
        status: 'started',
        started_at: now,
        updated_at: now
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    // Update all in-lobby groups to 'playing'
    await client
      .from('session_groups')
      .update({ status: 'playing', current_stage: 'dashboard', updated_at: now })
      .eq('session_id', sessionId)
      .eq('status', 'in_lobby');

    return data;
  },

  /**
   * Pause the active game session
   */
  async pauseSession(sessionId) {
    const client = getSupabaseClient();
    if (!client) return null;
    const now = this.getNow().toISOString();
    const { data, error } = await client
      .from('game_sessions')
      .update({ status: 'paused', updated_at: now })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Resume paused session
   */
  async resumeSession(sessionId) {
    const client = getSupabaseClient();
    if (!client) return null;
    const now = this.getNow().toISOString();
    const { data, error } = await client
      .from('game_sessions')
      .update({ status: 'started', updated_at: now })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Finish / End session
   */
  async completeSession(sessionId) {
    const client = getSupabaseClient();
    if (!client) return null;
    const now = this.getNow().toISOString();
    const { data, error } = await client
      .from('game_sessions')
      .update({ status: 'completed', completed_at: now, updated_at: now })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Reset session: clears all submissions and resets group scores
   */
  async resetSession(sessionId) {
    const client = getSupabaseClient();
    if (!client) return null;

    // Delete submissions
    await client
      .from('group_submissions')
      .delete()
      .eq('session_id', sessionId);

    // Reset session
    await client
      .from('game_sessions')
      .update({ status: 'waiting', started_at: null, completed_at: null, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    // Reset groups
    const { data, error } = await client
      .from('session_groups')
      .update({
        score_quiz: 0,
        score_memory: 0,
        score_calc: 0,
        final_score: 0,
        accuracy: 0,
        duration_seconds: 0,
        predicate: 'TEMPERATURE ROOKIE',
        status: 'in_lobby',
        current_stage: 'dashboard',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select();

    if (error) throw error;
    return data;
  },

  // ========================================================================
  // GROUP MEMBERSHIP & LOBBY
  // ========================================================================

  /**
   * Fetch all 8 group slots for a session
   */
  async getGroups(sessionId) {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
      .from('session_groups')
      .select('*')
      .eq('session_id', sessionId)
      .order('group_number', { ascending: true });

    if (error) {
      console.error('Error fetching session groups:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Join or reconnect as a group in the session
   */
  async joinGroup(sessionId, groupNumber, groupName, members, badge = '👥', theme = '') {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client belum terhubung.');

    const deviceToken = getDeviceToken();
    const num = parseInt(groupNumber, 10);
    const now = this.getNow().toISOString();

    // Check if slot is already occupied
    const { data: existing, error: checkErr } = await client
      .from('session_groups')
      .select('*')
      .eq('session_id', sessionId)
      .eq('group_number', num)
      .maybeSingle();

    if (checkErr) throw checkErr;

    if (existing) {
      // If it exists and has the same device token, allow reconnection
      if (existing.device_token === deviceToken) {
        // Update presence and members
        const { data: updated, error: updateErr } = await client
          .from('session_groups')
          .update({
            group_name: groupName || existing.group_name,
            members: members && members.length > 0 ? members : existing.members,
            is_online: true,
            last_active: now,
            updated_at: now
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateErr) throw updateErr;
        return updated;
      } else {
        // Different device trying to take this slot
        throw new Error(`Kelompok ${num} sudah diambil oleh perangkat lain pada sesi ini! Silakan pilih nomor kelompok lain atau hubungi Guru.`);
      }
    }

    // Insert new group record
    const { data, error } = await client
      .from('session_groups')
      .insert({
        session_id: sessionId,
        group_number: num,
        group_name: groupName,
        badge: badge,
        theme: theme,
        members: members,
        device_token: deviceToken,
        status: 'in_lobby',
        is_online: true,
        last_active: now
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update active group progress & scores in database
   */
  async updateGroupProgress(sessionId, groupNumber, updates) {
    const client = getSupabaseClient();
    if (!client) return null;

    const now = this.getNow().toISOString();
    const payload = {
      ...updates,
      last_active: now,
      updated_at: now
    };

    const { data, error } = await client
      .from('session_groups')
      .update(payload)
      .eq('session_id', sessionId)
      .eq('group_number', groupNumber)
      .select()
      .single();

    if (error) {
      console.error('Error updating group progress:', error);
    }
    return data;
  },

  // ========================================================================
  // SUBMISSIONS & ANTI-DUPLICATE ANSWER PREVENTION
  // ========================================================================

  /**
   * Submit an answer for Quiz, Memory, or Calculation
   * Unique constraint (session_id, group_number, mode, item_id) ensures
   * that answers cannot be submitted more than once!
   */
  async submitAnswer(sessionId, groupNumber, mode, itemId, answer, isCorrect, pointsEarned) {
    const client = getSupabaseClient();
    if (!client) return { success: false, reason: 'offline' };

    const payload = {
      session_id: sessionId,
      group_number: parseInt(groupNumber, 10),
      mode: mode,
      item_id: String(itemId),
      answer: String(answer),
      is_correct: Boolean(isCorrect),
      points_earned: Number(pointsEarned) || 0,
      submitted_at: this.getNow().toISOString()
    };

    const { data, error } = await client
      .from('group_submissions')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      // 23505 is PostgreSQL unique violation code
      if (error.code === '23505') {
        console.warn(`[Anti-Cheat] Answer for ${mode} item ${itemId} was already submitted.`);
        return { success: false, duplicate: true };
      }
      console.error('Error submitting answer:', error);
      return { success: false, error: error };
    }

    return { success: true, data: data };
  },

  /**
   * Fetch all recorded submissions for a group (useful for state recovery)
   */
  async getGroupSubmissions(sessionId, groupNumber) {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
      .from('group_submissions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('group_number', groupNumber);

    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
    return data || [];
  },

  // ========================================================================
  // REALTIME SYNCHRONIZATION & CHANNELS
  // ========================================================================

  /**
   * Subscribe to real-time session events:
   * - Session status changes (e.g. Admin clicks "Mulai Bersama")
   * - Group joining & score updates
   * - New submissions
   */
  subscribeToSession(sessionId, onSessionChange, onGroupChange, onSubmissionChange) {
    const client = getSupabaseClient();
    if (!client) return null;

    const channelName = `session_channel_${sessionId}`;
    const channel = client.channel(channelName);

    // Listen to changes on game_sessions
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
      (payload) => {
        if (typeof onSessionChange === 'function') {
          onSessionChange(payload.new || payload.old, payload.eventType);
        }
      }
    );

    // Listen to changes on session_groups
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'session_groups', filter: `session_id=eq.${sessionId}` },
      (payload) => {
        if (typeof onGroupChange === 'function') {
          onGroupChange(payload.new || payload.old, payload.eventType);
        }
      }
    );

    // Listen to new submissions (live stream of answers)
    if (typeof onSubmissionChange === 'function') {
      channel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'group_submissions', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          onSubmissionChange(payload.new);
        }
      );
    }

    channel.subscribe((status) => {
      console.log(`[Realtime] Subscription status for ${channelName}:`, status);
    });

    return channel;
  },

  /**
   * Unsubscribe from channel
   */
  unsubscribe(channel) {
    if (channel && channel.unsubscribe) {
      channel.unsubscribe();
    }
  }
};
