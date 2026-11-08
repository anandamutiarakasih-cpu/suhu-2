/**
 * THERMO CHAMPIONS: SUHU EDITION (SUHU 2)
 * Main Controller & View Router
 */

import { particleService } from './services/particle-service.js';
import { firebaseService } from './services/firebase-service.js';
import { renderHomeView } from './views/home-view.js';
import { renderRegisterView } from './views/register-view.js';
import { renderWaitingView } from './views/waiting-view.js';
import { renderAdminView } from './views/admin-view.js';
import { renderGame1View } from './views/game1-view.js';
import { renderGame2View } from './views/game2-view.js';
import { renderGame3View } from './views/game3-view.js';
import { renderLeaderboardView } from './views/leaderboard-view.js';

class ThermoChampionsApp {
  constructor() {
    this.appContainer = document.getElementById('app-main');
    this.canvas = document.getElementById('bg-canvas');
    this.currentViewInstance = null;
    this.currentRoute = null;
    this.state = {
      sessionCode: null,
      teamNumber: null
    };
  }

  init() {
    // Start Thermal Energy Ambient Particles
    if (this.canvas) {
      particleService.init(this.canvas);
    }

    // Direct /admin route support
    const isExplicitAdmin = (typeof window !== 'undefined' && window.location && 
      (window.location.pathname.endsWith('/admin') || new URLSearchParams(window.location.search).has('admin')));

    if (isExplicitAdmin) {
      this.navigate('admin');
      return;
    }

    // Attach BeforeUnload warning: Warn user that refreshing resets the session
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', (e) => {
        if (this.currentRoute && this.currentRoute !== 'home' && this.currentRoute !== 'admin') {
          try {
            sessionStorage.setItem('tc_refresh_reset_notice', 'true');
          } catch (err) {}
          // Clear credentials so on reload it resets completely
          firebaseService.clearStoredTeamSession();
          e.preventDefault();
          e.returnValue = 'Perhatian: Me-refresh halaman akan mereset permainan dan mengeluarkan Anda dari sesi!';
          return e.returnValue;
        }
      });
    }

    // Check if page was refreshed while playing in a session
    let wasRefreshed = false;
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('tc_refresh_reset_notice') === 'true') {
        wasRefreshed = true;
        sessionStorage.removeItem('tc_refresh_reset_notice');
      }
    } catch (e) {}

    // On page load/refresh: ALWAYS reset local team session completely
    firebaseService.clearStoredTeamSession();
    this.state.sessionCode = null;
    this.state.teamNumber = null;

    // Check if session code was passed explicitly in URL (e.g. ?session=TC1234)
    let urlCode = null;
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const rawCode = urlParams.get('session');
        if (rawCode) urlCode = rawCode.trim().toUpperCase().replace(/[-\s]/g, '');
      }
    } catch (e) {}

    if (urlCode) {
      this.state.sessionCode = urlCode;
      this.navigate('register', { sessionCode: urlCode });
      return;
    }

    // Always navigate to Home view and inform if a refresh reset occurred
    this.navigate('home', { wasRefreshed });
  }

  async reconnectSession(sessionCode, teamNumber) {
    try {
      const session = await firebaseService.getSession(sessionCode);
      if (session) {
        if (session.status === 'FINISHED' || session.currentPhase === 'FINISHED') {
          firebaseService.clearStoredTeamSession();
          this.navigate('home');
          return;
        }

        const teamKey = `team_${teamNumber}`;
        if (!session.teams || !session.teams[teamKey] || !session.teams[teamKey].claimed) {
          firebaseService.clearStoredTeamSession();
          this.navigate('home');
          return;
        }

        this.routeByPhase(session.currentPhase || 'LOBBY');
        return;
      }
    } catch (e) {
      console.warn('Reconnect error:', e);
    }
    // Fallback if session no longer exists
    firebaseService.clearStoredTeamSession();
    this.navigate('home');
  }

  routeByPhase(phase) {
    switch (phase) {
      case 'LOBBY':
        this.navigate('waiting');
        break;
      case 'GAME1_MEMORIZE':
        this.navigate('game1_memorize');
        break;
      case 'GAME1_PLAY':
        this.navigate('game1_play');
        break;
      case 'GAME2':
        this.navigate('game2');
        break;
      case 'GAME3':
        this.navigate('game3');
        break;
      case 'FINISHED':
        this.navigate('leaderboard');
        break;
      default:
        this.navigate('waiting');
    }
  }

  navigate(route, params = {}) {
    if (this.currentViewInstance && typeof this.currentViewInstance.destroy === 'function') {
      this.currentViewInstance.destroy();
      this.currentViewInstance = null;
    }

    this.currentRoute = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reflect clean URL for admin/home if supported
    if (typeof window !== 'undefined' && window.history) {
      if (route === 'admin' && !window.location.pathname.endsWith('/admin')) {
        window.history.pushState({}, '', '/admin');
      } else if (route === 'home' && window.location.pathname.endsWith('/admin')) {
        window.history.pushState({}, '', '/');
      }
    }

    switch (route) {
      case 'home':
        this.currentViewInstance = renderHomeView(this.appContainer, {
          wasRefreshed: Boolean(params.wasRefreshed),
          onJoinTeam: (sessionCode) => {
            this.state.sessionCode = sessionCode;
            this.navigate('register', { sessionCode });
          },
          onOpenAdmin: () => {
            this.navigate('admin');
          }
        });
        break;

      case 'register':
        this.currentViewInstance = renderRegisterView(this.appContainer, {
          sessionCode: params.sessionCode || this.state.sessionCode,
          onRegistered: (code, num) => {
            this.state.sessionCode = code;
            this.state.teamNumber = num;
            this.navigate('waiting');
          },
          onBack: () => {
            this.navigate('home');
          }
        });
        break;

      case 'waiting':
        this.currentViewInstance = renderWaitingView(this.appContainer, {
          sessionCode: this.state.sessionCode,
          teamNumber: this.state.teamNumber,
          onPhaseChange: (newPhase) => {
            this.routeByPhase(newPhase);
          }
        });
        break;

      case 'admin':
        this.currentViewInstance = renderAdminView(this.appContainer, {
          onExit: () => {
            this.navigate('home');
          }
        });
        break;

      case 'game1_memorize':
        this.currentViewInstance = renderGame1View(this.appContainer, {
          sessionCode: this.state.sessionCode,
          teamNumber: this.state.teamNumber,
          isMemorizePhase: true,
          onPhaseChange: (newPhase) => {
            this.routeByPhase(newPhase);
          }
        });
        break;

      case 'game1_play':
        this.currentViewInstance = renderGame1View(this.appContainer, {
          sessionCode: this.state.sessionCode,
          teamNumber: this.state.teamNumber,
          isMemorizePhase: false,
          onPhaseChange: (newPhase) => {
            this.routeByPhase(newPhase);
          }
        });
        break;

      case 'game2':
        this.currentViewInstance = renderGame2View(this.appContainer, {
          sessionCode: this.state.sessionCode,
          teamNumber: this.state.teamNumber,
          onPhaseChange: (newPhase) => {
            this.routeByPhase(newPhase);
          }
        });
        break;

      case 'game3':
        this.currentViewInstance = renderGame3View(this.appContainer, {
          sessionCode: this.state.sessionCode,
          teamNumber: this.state.teamNumber,
          onPhaseChange: (newPhase) => {
            this.routeByPhase(newPhase);
          }
        });
        break;

      case 'leaderboard':
        this.currentViewInstance = renderLeaderboardView(this.appContainer, {
          sessionCode: this.state.sessionCode,
          teamNumber: this.state.teamNumber,
          onHome: () => {
            firebaseService.clearStoredTeamSession();
            this.state.sessionCode = null;
            this.state.teamNumber = null;
            this.navigate('home');
          }
        });
        break;

      default:
        this.navigate('home');
    }
  }
}

// Bootstrap application on DOM load
window.addEventListener('DOMContentLoaded', () => {
  const app = new ThermoChampionsApp();
  app.init();
});
