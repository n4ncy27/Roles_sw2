import { useState, useEffect, useRef } from "react";

// ───DATA ───────────────────────────────────────────────────────────────────

const QUESTIONS = [
  { id: 1,  text: "Generalmente no me acerco a los problemas de forma creativa", category: "C" },
  { id: 2,  text: "Me gusta probar y luego revisar mis ideas antes de generar la solución o el producto final", category: "C" },
  { id: 3,  text: "Me gusta tomarme el tiempo para clarificar la naturaleza exacta del problema", category: "A" },
  { id: 4,  text: "Disfruto de tomar los pasos necesarios para poner mis ideas en acción", category: "D" },
  { id: 5,  text: "Me gusta separar un problema amplio en partes para examinarlo desde todos los ángulos", category: "C" },
  { id: 6,  text: "Tengo dificultad en tener ideas inusuales para resolver un problema", category: "B" },
  { id: 7,  text: "Me gusta identificar los hechos más relevantes relativos al problema", category: "A" },
  { id: 8,  text: "No tengo el temperamento para tratar de aislar las causas específicas de un problema", category: "A" },
  { id: 9,  text: "Disfruto al generar formas únicas de mirar un problema", category: "B" },
  { id: 10, text: "Me gusta generar todos los pro y contras de una solución potencial", category: "C" },
  { id: 11, text: "Antes de implementar una solución me gusta separarla en pasos", category: "C" },
  { id: 12, text: "Transformar ideas en acción no es lo que disfruto más", category: "D" },
  { id: 13, text: "Me gusta superar los criterios que pueden usarse para identificar la mejor opción o solución", category: "C" },
  { id: 14, text: "Disfruto de pasar tiempo profundizando el análisis inicial del problema", category: "B" },
  { id: 15, text: "Por naturaleza no paso mucho tiempo emocionándome en definir el problema exacto a resolver", category: "A" },
  { id: 16, text: "Me gusta entender una situación al mirar el panorama general", category: "B" },
  { id: 17, text: "Disfruto de trabajar en problemas mal definidos y novedosos", category: "B" },
  { id: 18, text: "Cuando trabajo en un problema me gusta encontrar la mejor forma de enunciarlo", category: "A" },
  { id: 19, text: "Disfruto de hacer que las cosas se concreten", category: "D" },
  { id: 20, text: "Me gusta enfocarme en enunciar un problema en forma precisa", category: "A" },
  { id: 21, text: "Disfruto de usar mi imaginación para producir muchas ideas", category: "B" },
  { id: 22, text: "Me gusta enfocarme en la información clave de una situación desafiante", category: "A" },
  { id: 23, text: "Disfruto de tomarme el tiempo para perfeccionar una idea", category: "C" },
  { id: 24, text: "Me resulta difícil implementar mis ideas", category: "D" },
  { id: 25, text: "Disfruto de transformar ideas en bruto en soluciones concretas", category: "D" },
  { id: 26, text: "No paso el tiempo en todas las cosas que necesito hacer para implementar una idea", category: "D" },
  { id: 27, text: "Realmente disfruto de implementar una idea", category: "D" },
  { id: 28, text: "Antes de avanzar me gusta tener una clara comprensión del problema", category: "A" },
  { id: 29, text: "Me gusta trabajar con ideas únicas", category: "B" },
  { id: 30, text: "Disfruto de poner mis ideas en acción", category: "D" },
  { id: 31, text: "Me gusta explorar las fortalezas o debilidades de una solución potencial", category: "C" },
  { id: 32, text: "Disfruto de reunir información para identificar el origen de un problema particular", category: "A" },
  { id: 33, text: "Disfruto del análisis y el esfuerzo que lleva a transformar un concepto preliminar en una idea factible", category: "C" },
  { id: 34, text: "Mi tendencia natural no es generar muchas ideas para los problemas", category: "B" },
  { id: 35, text: "Disfruto de usar metáforas y analogías para generar nuevas ideas para los problemas", category: "B" },
  { id: 36, text: "Encuentro que tengo poca paciencia para el esfuerzo que lleva pulir o refinar una idea", category: "C" },
  { id: 37, text: "Tiendo a buscar una solución rápida y luego implementarla", category: "D" },
];

const ROLES = {
  A: {
    name: "Clarificador",
    color: "#1B4F8A",
    light: "#E8F0FB",
    border: "#ADC8EF",
    description: "Tiene habilidad para definir y analizar el problema central. Identifica hechos clave, clarifica el contexto y asegura que todos comprendan el verdadero desafío antes de actuar.",
  },
  B: {
    name: "Ideador",
    color: "#B5621C",
    light: "#FEF3E8",
    border: "#F5C68A",
    description: "Genera ideas creativas y originales con fluidez. Piensa de forma divergente, explora posibilidades poco convencionales y es motor de la innovación en el equipo.",
  },
  C: {
    name: "Desarrollador",
    color: "#1A7A6E",
    light: "#E7F7F5",
    border: "#8ED5CD",
    description: "Transforma conceptos en planes sólidos y viables. Evalúa opciones, refina propuestas y construye puentes entre las ideas y su ejecución práctica.",
  },
  D: {
    name: "Implementador",
    color: "#7B2D8B",
    light: "#F5EBF8",
    border: "#D4A8E0",
    description: "Lleva las ideas a la realidad con determinación. Ejecuta planes, supera obstáculos y se asegura de que los proyectos lleguen a su conclusión exitosa.",
  },
};

function convertScore(raw) {
  if (raw <= 2) return 1;
  if (raw <= 4) return 2;
  if (raw <= 6) return 3;
  if (raw <= 8) return 4;
  return 5;
}

function calculateResults(answers) {
  const scores = { A: 0, B: 0, C: 0, D: 0 };
  QUESTIONS.forEach((q) => {
    const raw = answers[q.id];
    if (raw != null) {
      scores[q.category] += convertScore(raw);
    }
  });
  return scores;
}

function getDominantRole(scores) {
  return Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  USERS: "swsurvey:users",
  RESPONSES: (uid) => `swsurvey:resp:${uid}`,
};

const DEFAULT_ADMIN = {
  id: "admin",
  username: "admin",
  password: "admin123",
  role: "admin",
  name: "Administrador",
};

const memoryStore = {};

async function storageGet(key) {
  try {
    const res = await window.storage.get(key);
    return res ? res.value : null;
  } catch {
    return memoryStore[key] ?? null;
  }
}

async function storageSet(key, value) {
  memoryStore[key] = value;
  try {
    await window.storage.set(key, value);
  } catch {
    // keep in memory only
  }
}

async function loadUsers() {
  const raw = await storageGet(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [DEFAULT_ADMIN];
}

async function saveUsers(users) {
  await storageSet(STORAGE_KEYS.USERS, JSON.stringify(users));
}

async function loadResponse(uid) {
  const raw = await storageGet(STORAGE_KEYS.RESPONSES(uid));
  return raw ? JSON.parse(raw) : null;
}

async function saveResponse(uid, data) {
  await storageSet(STORAGE_KEYS.RESPONSES(uid), JSON.stringify(data));
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F7F6F3;
    --surface: #FFFFFF;
    --surface2: #F0EEE9;
    --border: #E2DED6;
    --text: #1C1917;
    --text-muted: #78716C;
    --text-light: #A8A29E;
    --primary: #1B4F8A;
    --primary-light: #E8F0FB;
    --accent: #B5621C;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 2px 12px rgba(0,0,0,0.07);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.10);
    --font-head: 'Lora', Georgia, serif;
    --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
    --transition: 0.18s ease;
  }

  body { background: var(--bg); font-family: var(--font-body); color: var(--text); min-height: 100vh; }

  .app-wrapper { min-height: 100vh; }

  /* ── NAV ── */
  .nav {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-brand {
    font-family: var(--font-head);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary);
    letter-spacing: -0.01em;
  }
  .nav-brand span { color: var(--accent); }
  .nav-right { display: flex; align-items: center; gap: 16px; }
  .nav-user { font-size: 0.82rem; color: var(--text-muted); }
  .nav-user strong { color: var(--text); font-weight: 600; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-body); font-weight: 600; font-size: 0.875rem;
    padding: 10px 22px; border-radius: var(--radius-sm);
    border: none; cursor: pointer; transition: all var(--transition);
    text-decoration: none; white-space: nowrap;
  }
  .btn-primary {
    background: var(--primary); color: #fff;
  }
  .btn-primary:hover { background: #153d6d; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(27,79,138,0.25); }
  .btn-secondary {
    background: var(--surface2); color: var(--text); border: 1px solid var(--border);
  }
  .btn-secondary:hover { background: var(--border); }
  .btn-ghost { background: transparent; color: var(--primary); padding: 8px 16px; }
  .btn-ghost:hover { background: var(--primary-light); }
  .btn-danger { background: #DC2626; color: #fff; }
  .btn-danger:hover { background: #B91C1C; }
  .btn-sm { padding: 6px 14px; font-size: 0.8rem; }
  .btn-lg { padding: 14px 32px; font-size: 0.95rem; border-radius: var(--radius); }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  /* ── FORM ── */
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
  .form-label { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .form-input {
    font-family: var(--font-body); font-size: 0.95rem;
    padding: 11px 14px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: var(--surface);
    color: var(--text); transition: border-color var(--transition);
    outline: none;
  }
  .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(27,79,138,0.1); }

  /* ── LOGIN ── */
  .login-screen {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 480px;
    background: var(--bg);
  }
  .login-hero {
    background: linear-gradient(145deg, #1B4F8A 0%, #0D2F5A 50%, #1A2E4A 100%);
    display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end;
    padding: 64px;
    position: relative; overflow: hidden;
  }
  .login-hero::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(181,98,28,0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(26,122,110,0.1) 0%, transparent 50%);
  }
  .login-hero-content { position: relative; z-index: 1; }
  .login-hero h1 {
    font-family: var(--font-head);
    font-size: 2.6rem;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 16px;
    font-weight: 700;
  }
  .login-hero h1 em { font-style: italic; color: rgba(255,255,255,0.7); }
  .login-hero p { color: rgba(255,255,255,0.6); font-size: 0.95rem; max-width: 360px; line-height: 1.65; }
  .login-hero-roles { display: flex; gap: 12px; margin-top: 40px; flex-wrap: wrap; }
  .login-role-chip {
    padding: 6px 16px; border-radius: 100px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85); font-size: 0.78rem; font-weight: 500;
  }
  .login-panel {
    background: var(--surface);
    display: flex; flex-direction: column; justify-content: center;
    padding: 64px 56px;
    border-left: 1px solid var(--border);
  }
  .login-panel-header { margin-bottom: 40px; }
  .login-panel-header h2 { font-family: var(--font-head); font-size: 1.75rem; font-weight: 700; color: var(--text); }
  .login-panel-header p { color: var(--text-muted); margin-top: 8px; font-size: 0.9rem; }
  .login-tabs { display: flex; gap: 4px; margin-bottom: 32px; background: var(--surface2); border-radius: var(--radius-sm); padding: 4px; }
  .login-tab {
    flex: 1; padding: 8px; border: none; border-radius: 6px; background: transparent;
    font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
    cursor: pointer; color: var(--text-muted); transition: all var(--transition);
  }
  .login-tab.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow); }
  .error-msg {
    background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--radius-sm);
    padding: 10px 14px; color: #B91C1C; font-size: 0.85rem; margin-bottom: 16px;
  }
  .register-link { text-align: center; margin-top: 24px; font-size: 0.85rem; color: var(--text-muted); }
  .register-link button { background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; font-size: 0.85rem; }

  /* ── REGISTER MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.35);
    backdrop-filter: blur(4px); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal { background: var(--surface); border-radius: var(--radius); padding: 40px; width: 440px; max-width: 90vw; box-shadow: var(--shadow-lg); }
  .modal h3 { font-family: var(--font-head); font-size: 1.4rem; margin-bottom: 8px; }
  .modal p { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 28px; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  /* ── SURVEY ── */
  .survey-layout { max-width: 780px; margin: 0 auto; padding: 40px 24px 80px; }
  .survey-header { margin-bottom: 36px; }
  .survey-header h2 { font-family: var(--font-head); font-size: 1.6rem; color: var(--text); }
  .survey-header p { color: var(--text-muted); margin-top: 8px; font-size: 0.9rem; line-height: 1.6; }

  .progress-bar-wrap {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px 24px; margin-bottom: 28px;
  }
  .progress-bar-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-bar-label span { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); }
  .progress-bar-label strong { font-size: 0.82rem; color: var(--primary); }
  .progress-track { height: 6px; background: var(--surface2); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), #4A90D9); border-radius: 100px; transition: width 0.4s ease; }

  .question-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 28px 32px; margin-bottom: 16px;
    animation: slideUp 0.3s ease; transition: border-color var(--transition);
  }
  .question-card.answered { border-color: #ADC8EF; }
  .question-number { font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
  .question-text { font-size: 1rem; line-height: 1.6; color: var(--text); font-weight: 500; margin-bottom: 24px; }

  .scale-wrapper { display: flex; flex-direction: column; gap: 8px; }
  .scale-labels { display: flex; justify-content: space-between; padding: 0 4px; }
  .scale-labels span { font-size: 0.72rem; color: var(--text-light); font-weight: 500; }
  .scale-buttons { display: flex; gap: 6px; align-items: center; }
  .scale-btn {
    flex: 1; aspect-ratio: 1; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: var(--surface2);
    cursor: pointer; transition: all var(--transition);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-body); font-size: 0.8rem; font-weight: 600;
    color: var(--text-muted); min-height: 44px;
  }
  .scale-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
  .scale-btn.selected { background: var(--primary); border-color: var(--primary); color: #fff; transform: scale(1.08); box-shadow: 0 4px 12px rgba(27,79,138,0.3); }

  .scale-divider { width: 2px; height: 20px; background: var(--border); flex-shrink: 0; border-radius: 2px; }

  .survey-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; }

  .page-indicator { font-size: 0.82rem; color: var(--text-muted); }

  /* ── RESULTS ── */
  .results-layout { max-width: 780px; margin: 0 auto; padding: 48px 24px 80px; animation: slideUp 0.4s ease; }
  .results-hero { text-align: center; margin-bottom: 48px; }
  .results-hero-badge {
    display: inline-block; padding: 6px 20px; border-radius: 100px;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .results-hero h2 { font-family: var(--font-head); font-size: 2.2rem; color: var(--text); margin-bottom: 12px; }
  .results-hero p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; max-width: 500px; margin: 0 auto; }

  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .role-result-card {
    border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px;
    background: var(--surface); transition: all var(--transition); position: relative; overflow: hidden;
  }
  .role-result-card.dominant { box-shadow: var(--shadow-lg); }
  .role-result-card.dominant::before {
    content: 'Perfil dominante';
    position: absolute; top: 12px; right: 12px;
    background: var(--primary); color: #fff;
    font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
    padding: 3px 10px; border-radius: 100px;
  }
  .role-result-name { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; }
  .role-result-score { font-size: 2.2rem; font-weight: 700; line-height: 1; margin-bottom: 4px; }
  .role-result-max { font-size: 0.78rem; color: var(--text-light); margin-bottom: 14px; }
  .role-result-bar-track { height: 8px; background: var(--surface2); border-radius: 100px; overflow: hidden; }
  .role-result-bar-fill { height: 100%; border-radius: 100px; transition: width 0.8s ease; }
  .role-result-desc { font-size: 0.83rem; color: var(--text-muted); line-height: 1.6; margin-top: 14px; }

  /* ── ADMIN DASHBOARD ── */
  .admin-layout { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
  .admin-header { margin-bottom: 36px; }
  .admin-header h2 { font-family: var(--font-head); font-size: 1.8rem; }
  .admin-header p { color: var(--text-muted); margin-top: 6px; font-size: 0.9rem; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px 24px; }
  .stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 8px; }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--text); line-height: 1; }
  .stat-sub { font-size: 0.8rem; color: var(--text-light); margin-top: 4px; }

  .section-title { font-family: var(--font-head); font-size: 1.15rem; color: var(--text); margin-bottom: 16px; font-weight: 700; }

  .roles-overview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 36px; }
  .roles-overview-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; display: flex; flex-direction: column; gap: 8px;
  }
  .roles-overview-dot { width: 10px; height: 10px; border-radius: 50%; }
  .roles-overview-name { font-size: 0.85rem; font-weight: 700; }
  .roles-overview-count { font-size: 1.6rem; font-weight: 700; }
  .roles-overview-label { font-size: 0.75rem; color: var(--text-muted); }

  .users-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .users-table { width: 100%; border-collapse: collapse; }
  .users-table th {
    background: var(--surface2); padding: 12px 20px; text-align: left;
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text-muted); border-bottom: 1px solid var(--border);
  }
  .users-table td { padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
  .users-table tr:last-child td { border-bottom: none; }
  .users-table tr:hover td { background: var(--surface2); cursor: pointer; }

  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 700;
  }
  .status-badge.completed { background: #ECFDF5; color: #065F46; }
  .status-badge.pending { background: #FEF9EC; color: #92400E; }
  .role-badge {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  }

  /* ── USER DETAIL ── */
  .detail-layout { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
  .back-btn { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; cursor: pointer; margin-bottom: 28px; background: none; border: none; }
  .back-btn:hover { color: var(--primary); }

  .detail-profile { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 32px; margin-bottom: 24px; display: flex; align-items: center; gap: 24px; }
  .detail-avatar { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-head); font-size: 1.4rem; font-weight: 700; flex-shrink: 0; }
  .detail-info h3 { font-family: var(--font-head); font-size: 1.3rem; }
  .detail-info p { color: var(--text-muted); font-size: 0.875rem; margin-top: 4px; }

  .detail-scores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .detail-score-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .detail-score-card.dominant { border-width: 2px; }

  .answers-grid { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .answers-grid-header { background: var(--surface2); padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .answers-grid-header h4 { font-size: 0.85rem; font-weight: 700; color: var(--text); }
  .answer-row { display: grid; grid-template-columns: 32px 1fr 80px; gap: 16px; padding: 12px 20px; border-bottom: 1px solid var(--border); align-items: center; font-size: 0.83rem; }
  .answer-row:last-child { border-bottom: none; }
  .answer-row:hover { background: var(--surface2); }
  .answer-num { color: var(--text-light); font-weight: 600; font-size: 0.75rem; }
  .answer-text { color: var(--text); line-height: 1.45; }
  .answer-score { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
  .score-dot { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }

  /* ── WELCOME ── */
  .welcome-layout { max-width: 640px; margin: 0 auto; padding: 64px 24px; text-align: center; animation: slideUp 0.4s ease; }
  .welcome-icon { width: 72px; height: 72px; background: var(--primary-light); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
  .welcome-icon svg { color: var(--primary); }
  .welcome-layout h2 { font-family: var(--font-head); font-size: 2rem; margin-bottom: 16px; }
  .welcome-layout p { color: var(--text-muted); line-height: 1.7; font-size: 0.95rem; margin-bottom: 12px; }
  .welcome-info { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 28px; margin: 32px 0; text-align: left; }
  .welcome-info-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .welcome-info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .welcome-info-row:first-child { padding-top: 0; }
  .info-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .welcome-info-row div { font-size: 0.875rem; }
  .welcome-info-row strong { display: block; color: var(--text); font-weight: 600; margin-bottom: 2px; }
  .welcome-info-row span { color: var(--text-muted); line-height: 1.5; }

  /* ── ALREADY COMPLETED ── */
  .completed-banner { background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: var(--radius); padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 12px; color: #065F46; font-size: 0.875rem; font-weight: 500; }

  /* ── EMPTY ── */
  .empty-state { text-align: center; padding: 48px; color: var(--text-muted); }
  .empty-state svg { margin-bottom: 16px; opacity: 0.35; }
  .empty-state p { font-size: 0.9rem; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .login-screen { grid-template-columns: 1fr; }
    .login-hero { display: none; }
    .login-panel { padding: 48px 32px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .roles-overview { grid-template-columns: repeat(2, 1fr); }
    .results-grid { grid-template-columns: 1fr; }
    .detail-scores { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .nav { padding: 0 20px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .roles-overview { grid-template-columns: repeat(2, 1fr); }
    .detail-scores { grid-template-columns: 1fr 1fr; }
    .scale-buttons { gap: 3px; }
    .scale-btn { font-size: 0.7rem; min-height: 38px; }
  }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ user, onLogout }) {
  return (
    <nav className="nav">
      <div className="nav-brand">Perfil<span>Soft</span></div>
      {user && (
        <div className="nav-right">
          <span className="nav-user">
            Bienvenido, <strong>{user.name}</strong>
            {user.role === "admin" && " · Administrador"}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password) { setError("Completa todos los campos."); return; }
    setError("");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const users = await loadUsers();
      const found = users.find(
        (u) => u.username === username.trim() && u.password === password && u.role === tab
      );
      if (found) {
        onLogin(found);
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setError("Error al conectar. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="login-screen">
      <div className="login-hero">
        <div className="login-hero-content">
          <h1>
            Descubre tu <em>rol natural</em> en proyectos de software
          </h1>
          <p>
            Una evaluación basada en evidencia para identificar cómo contribuyes mejor en equipos de desarrollo. Responde las afirmaciones con honestidad y obtén tu perfil.
          </p>
          <div className="login-hero-roles">
            {Object.values(ROLES).map((r) => (
              <span key={r.name} className="login-role-chip">{r.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-panel-header">
          <h2>Iniciar sesión</h2>
          <p>Ingresa con tus credenciales para continuar</p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === "user" ? "active" : ""}`} onClick={() => { setTab("user"); setError(""); }}>
            Participante
          </button>
          <button className={`login-tab ${tab === "admin" ? "active" : ""}`} onClick={() => { setTab("admin"); setError(""); }}>
            Administrador
          </button>
        </div>

        <div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tu nombre de usuario"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </div>

        {tab === "user" && (
          <div className="register-link">
            ¿No tienes cuenta?{" "}
            <button onClick={() => setShowRegister(true)}>Registrarse</button>
          </div>
        )}
      </div>

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onRegistered={(u) => { setShowRegister(false); onLogin(u); }}
        />
      )}
    </div>
  );
}

function RegisterModal({ onClose, onRegistered }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || !username.trim() || !password) { setError("Completa todos los campos."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (username.trim().includes(" ")) { setError("El usuario no puede contener espacios."); return; }
    setLoading(true);
    try {
      const users = await loadUsers();
      if (users.find((u) => u.username === username.trim())) {
        setError("El nombre de usuario ya existe.");
        setLoading(false);
        return;
      }
      const newUser = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        username: username.trim(),
        password,
        role: "user",
      };
      await saveUsers([...users, newUser]);
      onRegistered(newUser);
    } catch (err) {
      setError("Error al registrar. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ animation: "slideUp 0.25s ease" }}>
        <h3>Crear cuenta</h3>
        <p>Registra tus datos para acceder al cuestionario de perfil profesional</p>
        <div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Ana Torres" />
          </div>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Sin espacios" />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WELCOME / START ─────────────────────────────────────────────────────────

function WelcomeScreen({ user, existingResponse, onStart, onViewResults }) {
  const isCompleted = existingResponse?.completed;

  return (
    <div className="welcome-layout">
      <div className="welcome-icon">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      </div>

      <h2>Cuestionario de Perfil Profesional</h2>
      <p>Responde 37 afirmaciones con honestidad para descubrir qué rol se adapta mejor a tu forma natural de trabajar en proyectos de software.</p>

      {isCompleted && (
        <div className="completed-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Ya completaste el cuestionario el {new Date(existingResponse.submittedAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}.
        </div>
      )}

      <div className="welcome-info">
        <div className="welcome-info-row">
          <div className="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B4F8A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div>
            <strong>Duración estimada</strong>
            <span>10 a 15 minutos para completar las 37 afirmaciones</span>
          </div>
        </div>
        <div className="welcome-info-row">
          <div className="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B4F8A" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </div>
          <div>
            <strong>Escala de respuesta</strong>
            <span>Para cada afirmación, selecciona del 1 al 10 qué tanto se parece a ti</span>
          </div>
        </div>
        <div className="welcome-info-row">
          <div className="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B4F8A" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <strong>Confidencialidad</strong>
            <span>No hay respuestas correctas o incorrectas. Responde con sinceridad</span>
          </div>
        </div>
        <div className="welcome-info-row">
          <div className="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B4F8A" strokeWidth="2"><path d="M9 11l3 3L22 4"/></svg>
          </div>
          <div>
            <strong>Resultado inmediato</strong>
            <span>Al finalizar verás tu perfil dominante y la puntuación en cada rol</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          {isCompleted ? "Responder de nuevo" : "Comenzar evaluación"}
        </button>
        {isCompleted && (
          <button className="btn btn-secondary btn-lg" onClick={onViewResults}>
            Ver mis resultados
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SURVEY ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

function SurveyScreen({ user, onComplete }) {
  const totalPages = Math.ceil(QUESTIONS.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const topRef = useRef(null);

  const startIdx = page * PAGE_SIZE;
  const pageQuestions = QUESTIONS.slice(startIdx, startIdx + PAGE_SIZE);
  const answered = Object.keys(answers).length;
  const progress = (answered / QUESTIONS.length) * 100;

  const pageAnswered = pageQuestions.every((q) => answers[q.id] != null);
  const allAnswered = QUESTIONS.every((q) => answers[q.id] != null);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleAnswer = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleNext = () => {
    if (page < totalPages - 1) { setPage((p) => p + 1); scrollTop(); }
  };
  const handleBack = () => {
    if (page > 0) { setPage((p) => p - 1); scrollTop(); }
  };

  const handleSubmit = async () => {
    const scores = calculateResults(answers);
    const dominant = getDominantRole(scores);
    const responseData = { answers, completed: true, submittedAt: new Date().toISOString(), scores, dominant };
    await saveResponse(user.id, responseData);
    onComplete(responseData);
  };

  return (
    <div className="survey-layout" ref={topRef}>
      <div className="survey-header">
        <h2>Cuestionario de Perfil Profesional</h2>
        <p>Lee cada afirmación y selecciona del 1 al 10 qué tanto se parece a tu forma de ser. El 1 indica "Poco se parece a mí" y el 10 "Se parece mucho a mí".</p>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-label">
          <span>Progreso de respuesta</span>
          <strong>{answered} de {QUESTIONS.length} afirmaciones</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {pageQuestions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={startIdx + i}
          value={answers[q.id]}
          onChange={(val) => handleAnswer(q.id, val)}
        />
      ))}

      <div className="survey-nav">
        <button className="btn btn-secondary" onClick={handleBack} disabled={page === 0}>
          Anterior
        </button>
        <span className="page-indicator">Página {page + 1} de {totalPages}</span>
        {page < totalPages - 1 ? (
          <button className="btn btn-primary" onClick={handleNext} disabled={!pageAnswered}>
            Siguiente
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered}>
            Ver mis resultados
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, index, value, onChange }) {
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className={`question-card ${value != null ? "answered" : ""}`}>
      <div className="question-number">Afirmación {index + 1}</div>
      <div className="question-text">{question.text}</div>
      <div className="scale-wrapper">
        <div className="scale-labels">
          <span>Poco se parece a mí</span>
          <span>Neutral</span>
          <span>Se parece mucho a mí</span>
        </div>
        <div className="scale-buttons">
          {labels.map((n, i) => (
            <>
              {i === 5 && <div key="div" className="scale-divider" />}
              <button
                key={n}
                className={`scale-btn ${value === n ? "selected" : ""}`}
                onClick={() => onChange(n)}
              >
                {n}
              </button>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────

function ResultsScreen({ responseData, onRetake }) {
  const { scores, dominant } = responseData;
  const maxPossible = { A: 45, B: 45, C: 50, D: 45 };
  const dominantRole = ROLES[dominant];

  return (
    <div className="results-layout">
      <div className="results-hero">
        <div
          className="results-hero-badge"
          style={{ background: dominantRole.light, color: dominantRole.color, border: `1px solid ${dominantRole.border}` }}
        >
          Tu perfil dominante
        </div>
        <h2>Eres <span style={{ color: dominantRole.color }}>{dominantRole.name}</span></h2>
        <p>{dominantRole.description}</p>
      </div>

      <div className="results-grid">
        {Object.entries(ROLES).map(([key, role]) => {
          const score = scores[key];
          const max = maxPossible[key];
          const pct = Math.round((score / max) * 100);
          const isDominant = key === dominant;
          return (
            <div
              key={key}
              className={`role-result-card ${isDominant ? "dominant" : ""}`}
              style={{ borderColor: isDominant ? role.color : undefined }}
            >
              <div className="role-result-name" style={{ color: role.color }}>{role.name}</div>
              <div className="role-result-score" style={{ color: role.color }}>{score}</div>
              <div className="role-result-max">de {max} pts posibles ({pct}%)</div>
              <div className="role-result-bar-track">
                <div className="role-result-bar-fill" style={{ width: `${pct}%`, background: role.color }} />
              </div>
              <div className="role-result-desc">{role.description}</div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button className="btn btn-secondary" onClick={onRetake}>Responder de nuevo</button>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

function AdminDashboard({ onViewUser }) {
  const [users, setUsers] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const allUsers = await loadUsers();
      const participants = allUsers.filter((u) => u.role === "user");
      setUsers(participants);
      const resp = {};
      await Promise.all(participants.map(async (u) => {
        resp[u.id] = await loadResponse(u.id);
      }));
      setResponses(resp);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Cargando datos...</div>;

  const completed = users.filter((u) => responses[u.id]?.completed);
  const pending = users.length - completed.length;

  // Role distribution
  const roleCount = { A: 0, B: 0, C: 0, D: 0 };
  completed.forEach((u) => {
    const r = responses[u.id]?.dominant;
    if (r) roleCount[r]++;
  });

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <p>Resumen de participantes y resultados del cuestionario de perfil profesional</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total participantes</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-sub">Cuentas registradas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completados</div>
          <div className="stat-value" style={{ color: "#065F46" }}>{completed.length}</div>
          <div className="stat-sub">Cuestionarios finalizados</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendientes</div>
          <div className="stat-value" style={{ color: "#92400E" }}>{pending}</div>
          <div className="stat-sub">Sin completar</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tasa de finalización</div>
          <div className="stat-value">{users.length > 0 ? Math.round((completed.length / users.length) * 100) : 0}%</div>
          <div className="stat-sub">Del total registrado</div>
        </div>
      </div>

      {completed.length > 0 && (
        <>
          <p className="section-title">Distribución por perfil dominante</p>
          <div className="roles-overview">
            {Object.entries(ROLES).map(([key, role]) => (
              <div className="roles-overview-card" key={key} style={{ borderLeft: `4px solid ${role.color}` }}>
                <div className="roles-overview-dot" style={{ background: role.color }} />
                <div className="roles-overview-name" style={{ color: role.color }}>{role.name}</div>
                <div className="roles-overview-count">{roleCount[key]}</div>
                <div className="roles-overview-label">
                  {completed.length > 0 ? Math.round((roleCount[key] / completed.length) * 100) : 0}% del total
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="section-title">Lista de participantes</p>
      {users.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          <p>Aún no hay participantes registrados</p>
        </div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Participante</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Perfil dominante</th>
                <th>Puntaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const resp = responses[u.id];
                const done = resp?.completed;
                const dom = resp?.dominant;
                const role = dom ? ROLES[dom] : null;
                return (
                  <tr key={u.id} onClick={() => onViewUser(u, resp)} title="Ver detalle">
                    <td><strong style={{ color: "var(--text)" }}>{u.name}</strong></td>
                    <td style={{ color: "var(--text-muted)" }}>@{u.username}</td>
                    <td>
                      <span className={`status-badge ${done ? "completed" : "pending"}`}>
                        {done ? "Completado" : "Pendiente"}
                      </span>
                    </td>
                    <td>
                      {role ? (
                        <span className="role-badge" style={{ background: role.light, color: role.color, border: `1px solid ${role.border}` }}>
                          {role.name}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>Sin datos</span>
                      )}
                    </td>
                    <td>
                      {done && dom ? (
                        <span style={{ fontWeight: 700, color: role.color }}>{resp.scores[dom]} pts</span>
                      ) : "—"}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {done ? new Date(resp.submittedAt).toLocaleDateString("es-CO") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── USER DETAIL (ADMIN) ──────────────────────────────────────────────────────

function UserDetailScreen({ user, response, onBack }) {
  const { scores, dominant, answers } = response;
  const maxPossible = { A: 45, B: 45, C: 50, D: 45 };
  const domRole = ROLES[dominant];

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="detail-layout">
      <button className="back-btn" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Volver al panel
      </button>

      <div className="detail-profile">
        <div className="detail-avatar" style={{ background: domRole.light, color: domRole.color }}>
          {initials}
        </div>
        <div className="detail-info">
          <h3>{user.name}</h3>
          <p>@{user.username} · Perfil dominante: <strong style={{ color: domRole.color }}>{domRole.name}</strong> · {new Date(response.submittedAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="detail-scores">
        {Object.entries(ROLES).map(([key, role]) => {
          const score = scores[key];
          const max = maxPossible[key];
          const pct = Math.round((score / max) * 100);
          const isDom = key === dominant;
          return (
            <div key={key} className={`detail-score-card ${isDom ? "dominant" : ""}`} style={{ borderColor: isDom ? role.color : undefined }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: role.color, marginBottom: 8 }}>
                {role.name}
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: role.color, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: "4px 0 10px" }}>de {max} pts ({pct}%)</div>
              <div style={{ height: 6, background: "var(--surface2)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: role.color, borderRadius: 100 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="answers-grid">
        <div className="answers-grid-header">
          <h4>Respuestas individuales — {QUESTIONS.length} afirmaciones</h4>
        </div>
        {QUESTIONS.map((q, i) => {
          const raw = answers[q.id];
          const converted = raw != null ? convertScore(raw) : null;
          const role = ROLES[q.category];
          return (
            <div className="answer-row" key={q.id}>
              <span className="answer-num">{i + 1}</span>
              <span className="answer-text">{q.text}</span>
              <div className="answer-score">
                <div className="score-dot" style={{ background: role.light, color: role.color }}>
                  {converted ?? "—"}
                </div>
                <span style={{ color: "var(--text-light)", fontSize: "0.72rem" }}>/{raw}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); // login | welcome | survey | results | admin | adminDetail
  const [responseData, setResponseData] = useState(null);
  const [existingResponse, setExistingResponse] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const handleLogin = async (loggedUser) => {
    setUser(loggedUser);
    if (loggedUser.role === "admin") {
      setScreen("admin");
    } else {
      const existing = await loadResponse(loggedUser.id);
      setExistingResponse(existing);
      setScreen("welcome");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
    setResponseData(null);
    setExistingResponse(null);
    setSelectedUser(null);
    setSelectedResponse(null);
  };

  const handleStartSurvey = () => setScreen("survey");

  const handleViewResults = () => {
    setResponseData(existingResponse);
    setScreen("results");
  };

  const handleSurveyComplete = (data) => {
    setResponseData(data);
    setExistingResponse(data);
    setScreen("results");
  };

  const handleRetake = () => {
    setResponseData(null);
    setScreen("welcome");
  };

  const handleViewUser = (u, resp) => {
    if (!resp?.completed) return;
    setSelectedUser(u);
    setSelectedResponse(resp);
    setScreen("adminDetail");
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-wrapper">
        {screen !== "login" && <Navbar user={user} onLogout={handleLogout} />}
        {screen === "login" && <LoginScreen onLogin={handleLogin} />}
        {screen === "welcome" && (
          <WelcomeScreen
            user={user}
            existingResponse={existingResponse}
            onStart={handleStartSurvey}
            onViewResults={handleViewResults}
          />
        )}
        {screen === "survey" && <SurveyScreen user={user} onComplete={handleSurveyComplete} />}
        {screen === "results" && <ResultsScreen responseData={responseData} onRetake={handleRetake} />}
        {screen === "admin" && <AdminDashboard onViewUser={handleViewUser} />}
        {screen === "adminDetail" && selectedUser && selectedResponse && (
          <UserDetailScreen
            user={selectedUser}
            response={selectedResponse}
            onBack={() => setScreen("admin")}
          />
        )}
      </div>
    </>
  );
}
