/**
 * THERMO CHAMPIONS — SERVER-SYNCHRONIZED TIMERS
 * Accurate countdown & stopwatch with drift correction.
 */

import { getSyncedServerNow } from "../firebase/database.js";

export class SyncTimer {
  constructor({ durationSeconds, onTick, onComplete }) {
    this.durationSeconds = durationSeconds;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.timerId = null;
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
  }

  start(targetEndTimestamp = null) {
    this.stop();
    this.isRunning = true;
    const now = getSyncedServerNow();

    if (targetEndTimestamp) {
      this.endTime = targetEndTimestamp;
      this.startTime = this.endTime - (this.durationSeconds * 1000);
    } else {
      this.startTime = now;
      this.endTime = now + (this.durationSeconds * 1000);
    }

    this.tick();
    this.timerId = setInterval(() => this.tick(), 250);
  }

  tick() {
    if (!this.isRunning) return;
    const now = getSyncedServerNow();
    const remainingMs = Math.max(0, this.endTime - now);
    const remainingSec = Math.ceil(remainingMs / 1000);

    if (this.onTick) {
      this.onTick(remainingSec, remainingMs);
    }

    if (remainingMs <= 0) {
      this.stop();
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  getElapsedSeconds() {
    if (!this.startTime) return 0;
    const now = getSyncedServerNow();
    return Math.floor((now - this.startTime) / 1000);
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(s / 60);
  const remSec = s % 60;
  return `${mins.toString().padStart(2, '0')}:${remSec.toString().padStart(2, '0')}`;
}
