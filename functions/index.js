/**
 * THERMO CHAMPIONS — BACKEND CLOUD FUNCTIONS
 * Firebase Admin SDK + Secure Server-Side Scoring & Session Validation
 * Kunci jawaban dan validasi skor aman tersimpan di backend.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.database();

// ============================================================================
// SECURE QUESTION BANK & ANSWER KEYS (HANYA BERADA DI SERVER)
// ============================================================================

const SERVER_QUIZ_KEYS = {
  1: { correct: "B", weight: 3.5, exp: "Suhu adalah ukuran derajat panas atau dinginnya suatu benda secara kuantitatif." },
  2: { correct: "C", weight: 3.5, exp: "Pengukuran kulit manusia bersifat subjektif dan tidak menunjukkan nilai angka pasti." },
  3: { correct: "A", weight: 3.5, exp: "Lekukan kapiler mencegah raksa turun cepat saat termometer diangkat dari tubuh pasien." },
  4: { correct: "C", weight: 3.5, exp: "Kesetimbangan termal tercapai saat suhu termometer telah sama persis dengan suhu benda yang diukur." },
  5: { correct: "B", weight: 3.5, exp: "Titik tetap bawah Celsius (0°C) adalah suhu titik lebur es murni pada tekanan 1 atmosfer." },
  6: { correct: "C", weight: 3.5, exp: "Pada skala Fahrenheit, air murni mendidih pada tekanan normal menunjukkan angka 212°F." },
  7: { correct: "A", weight: 3.5, exp: "Rentang titik tetap bawah (0°R) ke titik tetap atas (80°R) pada Reamur adalah 80 skala." },
  8: { correct: "B", weight: 3.5, exp: "0 Kelvin adalah titik nol mutlak saat energi kinetik partikel berhenti bergerak secara teoritis." },
  9: { correct: "A", weight: 3.5, exp: "Perbandingan skala paling sederhana adalah C : R : (F-32) : (K-273) = 5 : 4 : 9 : 5." },
  10: { correct: "B", weight: 3.5, exp: "R = 4/5 × C = 4/5 × 25 = 20°R." }
};

const SERVER_MEMORY_KEYS = {
  1: { correct: "0°C", weight: 3.0, exp: "Titik tetap bawah termometer Celsius adalah 0°C." },
  2: { correct: "100°C", weight: 3.0, exp: "Titik tetap atas termometer Celsius adalah 100°C." },
  3: { correct: "32°F", weight: 3.0, exp: "Titik tetap bawah skala Fahrenheit adalah 32°F." },
  4: { correct: "212°F", weight: 3.0, exp: "Titik tetap atas skala Fahrenheit adalah 212°F." },
  5: { correct: "0°R", weight: 3.0, exp: "Titik tetap bawah skala Reamur adalah 0°R." },
  6: { correct: "80°R", weight: 3.0, exp: "Titik tetap atas skala Reamur adalah 80°R." },
  7: { correct: "273 K", weight: 3.0, exp: "Titik tetap bawah skala Kelvin adalah 273 K." },
  8: { correct: "373 K", weight: 3.0, exp: "Titik tetap atas skala Kelvin adalah 373 K." },
  9: { correct: "Alat pengukur derajat suhu baku", weight: 3.0, exp: "Termometer berfungsi sebagai alat pengukur derajat suhu yang baku." },
  10: { correct: "Kondisi ketika suhu benda dan termometer sudah sama", weight: 3.0, exp: "Kesetimbangan termal adalah kondisi saat suhu benda sama dengan alat ukur." }
};

const SERVER_CALC_KEYS = {
  1: { target: 86, tolerance: 0.1, weight: 7.0, exp: "F = (9/5 × 30) + 32 = 54 + 32 = 86°F" },
  2: { target: 32, tolerance: 0.1, weight: 7.0, exp: "R = 4/5 × 40 = 32°R" },
  3: { target: 300, tolerance: 0.1, weight: 7.0, exp: "K = 27 + 273 = 300 K" },
  4: { target: 100, tolerance: 0.1, weight: 7.0, exp: "C = 5/9 × (212 - 32) = 100°C" },
  5: {
    multiSteps: true,
    steps: {
      s5_a: { target: 75, tolerance: 0.1, weight: 3.5, exp: "C = 5/4 × 60 = 75°C" },
      s5_b: { target: 167, tolerance: 0.1, weight: 3.5, exp: "F = (9/5 × 75) + 32 = 135 + 32 = 167°F" }
    }
  }
};

function calculatePredicate(score) {
  const s = Math.round(score * 10) / 10;
  if (s >= 86) return { title: "THERMO CHAMPION", badge: "🏆", color: "#f59e0b" };
  if (s >= 76) return { title: "THERMO EXPERT", badge: "🥇", color: "#3b82f6" };
  if (s >= 66) return { title: "SCIENCE CHALLENGER", badge: "🥈", color: "#10b981" };
  if (s >= 56) return { title: "THERMO EXPLORER", badge: "🥉", color: "#8b5cf6" };
  return { title: "TEMPERATURE ROOKIE", badge: "🌱", color: "#64748b" };
}

// ============================================================================
// CLOUD FUNCTIONS (CALLABLE HTTPS)
// ============================================================================

/**
 * 1. createSession: Admin creates a new multiplayer tournament session
 */
exports.createSession = functions.https.onCall(async (data, context) => {
  const title = (data.title || "Turnamen Suhu IPA").trim();
  const rawCode = "TC-" + Math.floor(1000 + Math.random() * 9000);
  const sessionCode = rawCode.toUpperCase();
  const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  const sessionData = {
    id: sessionId,
    sessionCode: sessionCode,
    title: title,
    status: "waiting", // waiting | started | paused | ended
    createdAt: admin.database.ServerValue.TIMESTAMP,
    startedAt: null,
    endedAt: null,
    totalDurationSeconds: 0,
    createdBy: context.auth ? context.auth.uid : "admin"
  };

  const updates = {};
  updates[`/sessions/${sessionId}`] = sessionData;
  updates[`/sessionCodes/${sessionCode}`] = sessionId;

  await db.ref().update(updates);

  return {
    success: true,
    sessionId: sessionId,
    sessionCode: sessionCode,
    session: sessionData
  };
});

/**
 * 2. joinGroup: Student claims a group slot (1-8) with atomic lock
 */
exports.joinGroup = functions.https.onCall(async (data, context) => {
  const { sessionId, groupNumber, groupName, members, deviceToken } = data;

  if (!sessionId || !groupNumber || groupNumber < 1 || groupNumber > 8 || !deviceToken) {
    throw new functions.https.HttpsError("invalid-argument", "Data pendaftaran kelompok tidak valid.");
  }

  const groupKey = `group${groupNumber}`;
  const groupRef = db.ref(`/sessionGroups/${sessionId}/${groupKey}`);

  const txResult = await groupRef.transaction((current) => {
    if (current !== null) {
      // Slot sudah diambil. Izinkan reconnect HANYA jika deviceToken sama
      if (current.deviceToken === deviceToken) {
        current.isOnline = true;
        current.lastActive = admin.database.ServerValue.TIMESTAMP;
        return current;
      }
      // Diambil oleh perangkat lain
      return undefined; // abort
    }

    // Slot kosong, klaim secara atomic
    return {
      groupNumber: Number(groupNumber),
      groupName: (groupName || `Kelompok ${groupNumber}`).trim(),
      members: Array.isArray(members) ? members : [],
      deviceToken: deviceToken,
      ownerUid: context.auth ? context.auth.uid : null,
      status: "ready", // ready | in_game | finished
      isOnline: true,
      lastActive: admin.database.ServerValue.TIMESTAMP,
      scores: { quiz: 0, memory: 0, calc: 0, total: 0 },
      completedModes: { quiz: false, memory: false, calc: false },
      totalDurationSeconds: 0
    };
  });

  if (!txResult.committed) {
    return {
      success: false,
      message: `Kelompok ${groupNumber} sudah dipilih oleh perangkat lain! Silakan pilih nomor kelompok lain.`
    };
  }

  // Update leaderboard denormalized record
  const val = txResult.snapshot.val();
  await db.ref(`/leaderboards/${sessionId}/${groupKey}`).set({
    groupNumber: Number(groupNumber),
    groupName: val.groupName,
    membersCount: (val.members || []).length,
    skorQuiz: 0,
    skorMemory: 0,
    skorNumberChains: 0,
    totalSkor: 0,
    totalDurationSeconds: 0,
    status: "ready",
    predicate: "TEMPERATURE ROOKIE",
    lastUpdate: admin.database.ServerValue.TIMESTAMP
  });

  return {
    success: true,
    group: val
  };
});

/**
 * 3. startSession: Admin starts tournament for all groups simultaneously
 */
exports.startSession = functions.https.onCall(async (data, context) => {
  const { sessionId } = data;
  if (!sessionId) {
    throw new functions.https.HttpsError("invalid-argument", "Session ID diperlukan.");
  }

  const sessionRef = db.ref(`/sessions/${sessionId}`);
  const snap = await sessionRef.get();
  if (!snap.exists()) {
    throw new functions.https.HttpsError("not-found", "Sesi tidak ditemukan.");
  }

  const updates = {
    status: "started",
    startedAt: admin.database.ServerValue.TIMESTAMP
  };

  await sessionRef.update(updates);

  // Set all registered groups status to in_game
  const groupsSnap = await db.ref(`/sessionGroups/${sessionId}`).get();
  if (groupsSnap.exists()) {
    const groups = groupsSnap.val();
    const groupUpdates = {};
    for (const k in groups) {
      if (groups[k] && groups[k].status === "ready") {
        groupUpdates[`/sessionGroups/${sessionId}/${k}/status`] = "in_game";
        groupUpdates[`/leaderboards/${sessionId}/${k}/status`] = "in_game";
      }
    }
    if (Object.keys(groupUpdates).length > 0) {
      await db.ref().update(groupUpdates);
    }
  }

  return { success: true, status: "started" };
});

/**
 * 4. submitAnswer: Secure server-side validation & scoring for any of the 3 modes
 */
exports.submitAnswer = functions.https.onCall(async (data, context) => {
  const { sessionId, groupNumber, deviceToken, mode, itemId, answer, timeSpentSeconds } = data;

  if (!sessionId || !groupNumber || !mode || itemId === undefined || !deviceToken) {
    throw new functions.https.HttpsError("invalid-argument", "Argumen submitAnswer tidak lengkap.");
  }

  const groupKey = `group${groupNumber}`;
  const groupRef = db.ref(`/sessionGroups/${sessionId}/${groupKey}`);
  const gSnap = await groupRef.get();

  if (!gSnap.exists()) {
    throw new functions.https.HttpsError("not-found", "Kelompok tidak ditemukan pada sesi ini.");
  }

  const groupData = gSnap.val();
  if (groupData.deviceToken !== deviceToken) {
    throw new functions.https.HttpsError("permission-denied", "Perangkat tidak memiliki akses untuk kelompok ini.");
  }

  // Cek apakah item sudah pernah disubmit (anti replay/duplicate score)
  const subKey = `${mode}_${itemId}`;
  const subRef = db.ref(`/submissions/${sessionId}/${groupKey}/${subKey}`);
  const subSnap = await subRef.get();

  if (subSnap.exists()) {
    return {
      success: true,
      duplicate: true,
      message: "Soal ini sudah pernah dijawab sebelumnya.",
      awardedScore: subSnap.val().awardedScore || 0,
      isCorrect: subSnap.val().isCorrect || false
    };
  }

  let isCorrect = false;
  let awardedScore = 0;
  let explanation = "";

  // Mode 1: StarChamp Quiz
  if (mode === "quiz") {
    const itemKey = SERVER_QUIZ_KEYS[itemId];
    if (itemKey) {
      isCorrect = String(answer).trim().toUpperCase() === String(itemKey.correct).trim().toUpperCase();
      awardedScore = isCorrect ? itemKey.weight : 0;
      explanation = itemKey.exp;
    }
  }
  // Mode 2: Memory Madness (Recall)
  else if (mode === "memory") {
    const itemKey = SERVER_MEMORY_KEYS[itemId];
    if (itemKey) {
      isCorrect = String(answer).trim().toLowerCase() === String(itemKey.correct).trim().toLowerCase();
      awardedScore = isCorrect ? itemKey.weight : 0;
      explanation = itemKey.exp;
    }
  }
  // Mode 3: Number Chains
  else if (mode === "calc") {
    const stageKey = SERVER_CALC_KEYS[itemId];
    if (stageKey) {
      if (stageKey.multiSteps) {
        // Multi-step (misal tahap 5: step s5_a dan s5_b)
        const stepKey = data.stepId;
        const sInfo = stageKey.steps[stepKey];
        if (sInfo) {
          const numAns = parseFloat(answer);
          isCorrect = !isNaN(numAns) && Math.abs(numAns - sInfo.target) <= sInfo.tolerance;
          awardedScore = isCorrect ? sInfo.weight : 0;
          explanation = sInfo.exp;
        }
      } else {
        const numAns = parseFloat(answer);
        isCorrect = !isNaN(numAns) && Math.abs(numAns - stageKey.target) <= stageKey.tolerance;
        awardedScore = isCorrect ? stageKey.weight : 0;
        explanation = stageKey.exp;
      }
    }
  }

  // Catat record submission secara unik
  await subRef.set({
    mode,
    itemId,
    answer,
    isCorrect,
    awardedScore,
    deviceToken,
    submittedAt: admin.database.ServerValue.TIMESTAMP
  });

  // Update total score kelompok secara atomic menggunakan transaction
  let updatedGroup = null;
  await groupRef.transaction((curr) => {
    if (!curr) return curr;
    if (!curr.scores) curr.scores = { quiz: 0, memory: 0, calc: 0, total: 0 };

    if (mode === "quiz") curr.scores.quiz = Math.min(35, Math.round(((curr.scores.quiz || 0) + awardedScore) * 10) / 10);
    if (mode === "memory") curr.scores.memory = Math.min(30, Math.round(((curr.scores.memory || 0) + awardedScore) * 10) / 10);
    if (mode === "calc") curr.scores.calc = Math.min(35, Math.round(((curr.scores.calc || 0) + awardedScore) * 10) / 10);

    curr.scores.total = Math.min(100, Math.round((curr.scores.quiz + curr.scores.memory + curr.scores.calc) * 10) / 10);

    if (timeSpentSeconds && timeSpentSeconds > 0) {
      curr.totalDurationSeconds = (curr.totalDurationSeconds || 0) + Number(timeSpentSeconds);
    }
    curr.lastActive = admin.database.ServerValue.TIMESTAMP;
    updatedGroup = curr;
    return curr;
  });

  // Update leaderboard summary
  if (updatedGroup) {
    const pred = calculatePredicate(updatedGroup.scores.total);
    await db.ref(`/leaderboards/${sessionId}/${groupKey}`).update({
      skorQuiz: updatedGroup.scores.quiz,
      skorMemory: updatedGroup.scores.memory,
      skorNumberChains: updatedGroup.scores.calc,
      totalSkor: updatedGroup.scores.total,
      totalDurationSeconds: updatedGroup.totalDurationSeconds || 0,
      predicate: pred.title,
      lastUpdate: admin.database.ServerValue.TIMESTAMP
    });
  }

  return {
    success: true,
    isCorrect,
    awardedScore,
    explanation,
    totalScores: updatedGroup ? updatedGroup.scores : null
  };
});
