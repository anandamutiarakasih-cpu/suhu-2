/**
 * THERMO CHAMPIONS — GAME STATE & SESSION PERSISTENCE
 */

import { STORAGE_KEYS, getDeviceToken } from "../firebase/config.js";
import { rtdbEngine } from "../firebase/database.js";

class GameState {
  constructor() {
    this.session = null;
    this.group = null;
    this.activeMode = null;
    this.deviceToken = getDeviceToken();
    this.listeners = [];
  }

  setSession(session) {
    this.session = session;
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
    this.notify();
  }

  setGroup(group) {
    this.group = group;
    if (group) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GROUP, JSON.stringify(group));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_GROUP);
    }
    this.notify();
  }

  updateScores(scores) {
    if (!this.group) return;
    this.group.scores = {
      ...this.group.scores,
      ...scores
    };
    this.setGroup(this.group);
  }

  markModeDone(mode) {
    if (!this.group) return;
    if (!this.group.completedModes) this.group.completedModes = {};
    this.group.completedModes[mode] = true;
    this.setGroup(this.group);
  }

  clear() {
    this.session = null;
    this.group = null;
    this.activeMode = null;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_GROUP);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => {
      try { l(this); } catch (e) { console.error('State listener error:', e); }
    });
  }

  async restore() {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      const savedGroup = localStorage.getItem(STORAGE_KEYS.ACTIVE_GROUP);

      if (!savedSession || !savedGroup) return null;

      const session = JSON.parse(savedSession);
      const group = JSON.parse(savedGroup);

      if (!session || !group || !group.groupNumber) return null;
      const code = session.code || session.sessionCode || session.id;

      // Verify with Realtime Database / Cloud Relay
      const remoteSession = await rtdbEngine.getSession(code);
      if (remoteSession && remoteSession.teams) {
        const remoteGroup = remoteSession.teams[`group${group.groupNumber}`];
        if (remoteGroup && remoteGroup.deviceToken === this.deviceToken) {
          this.session = remoteSession;
          this.group = remoteGroup;
          this.notify();
          return { session: this.session, group: this.group };
        }
      }

      this.session = session;
      this.group = group;
      this.notify();
      return { session, group };
    } catch (e) {
      console.warn('[GameState] Could not restore saved state:', e);
      return null;
    }
  }
}

export const gameState = new GameState();
