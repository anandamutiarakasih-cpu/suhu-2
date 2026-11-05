/**
 * THERMO CHAMPIONS — FIREBASE SERVICE BRIDGES
 * Direct, fast client-to-RTDB operations without non-existent cloud function latency.
 */

import * as dbService from "./database.js";

/**
 * Call createSession directly via database service
 */
export async function callCreateSession(title, customCode = '') {
  return await dbService.createSession(title, customCode);
}

/**
 * Call joinGroup directly via database service
 */
export async function callJoinGroup(sessionId, groupNumber, groupName, members, deviceToken) {
  return await dbService.claimGroupSlot(sessionId, groupNumber, groupName, members, deviceToken);
}

/**
 * Call startSession directly via database service
 */
export async function callStartSession(sessionId) {
  const ok = await dbService.startTournamentTogether(sessionId);
  return { success: ok, status: 'started' };
}

/**
 * Call submitAnswer directly via database service
 */
export async function callSubmitAnswer(sessionId, groupNumber, deviceToken, mode, itemId, answer, isCorrectFallback, scoreWeight, timeSpentSeconds, stepId = null) {
  return await dbService.submitAnswerDirect(
    sessionId,
    groupNumber,
    deviceToken,
    mode,
    itemId,
    answer,
    isCorrectFallback,
    scoreWeight,
    timeSpentSeconds,
    stepId
  );
}
