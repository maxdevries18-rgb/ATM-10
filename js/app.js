import * as state from './state.js';
import * as renderer from './renderer.js';
import { buildSearchIndex, search } from './search.js';
import { loadDependencies } from './dependencies.js';

let phases = [];
let mods = [];
let allQuestData = {};
let depsData = { edges: [] };

async function fetchJSON(url) {
  const resp = await fetch(url);
  if (!resp.ok) return null;
  return resp.json();
}

async function loadQuestData(mod) {
  if (allQuestData[mod.id]) return allQuestData[mod.id];
  const data = await fetchJSON(`data/quests/${mod.questFile}`);
  if (data) allQuestData[mod.id] = data;
  return data;
}

async function init() {
  // Load state from localStorage
  state.loadProgress();
  state.loadUIState();

  // Load core data
  [phases, mods, depsData] = await Promise.all([
    fetchJSON('data/phases.json'),
    fetchJSON('data/mods.json'),
    fetchJSON('data/dependencies.json')
  ]);

  if (!phases || !mods) {
    document.getElementById('mainContent').innerHTML = '<p style="padding:2rem;color:var(--danger)">Kon data niet laden. Zorg dat je de app via een HTTP server opent.</p>';
    return;
  }

  if (!depsData) depsData = { edges: [] };

  // Load dependencies
  loadDependencies(depsData, mods);

  // Preload all quest data for stats and search
  await Promise.all(mods.map(mod => loadQuestData(mod)));

  // Build search index
  buildSearchIndex(mods, allQuestData);

  // Set up mod select handler
  renderer.setModSelectHandler(selectMod);

  // Render initial UI
  renderer.renderSidebar(phases, mods, allQuestData);
  renderer.renderWelcome(phases, mods);
  renderer.updateTotalStats(allQuestData);

  // Restore active mod if any
  const activeMod = state.getActiveMod();
  if (activeMod) {
    selectMod(activeMod);
  }

  // Set up search
  setupSearch();

  // Set up sidebar toggle (mobile)
  setupSidebarToggle();

  // Hide loading overlay
  const loading = document.getElementById('loadingOverlay');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 300);
  }
}

function selectMod(modId) {
  const mod = mods.find(m => m.id === modId);
  if (!mod) return;

  state.setActiveMod(modId);
  renderer.updateSidebarActive(modId);

  const questData = allQuestData[modId];
  renderer.renderModView(mod, questData, () => {
    // Called after step toggle - refresh sidebar and total stats
    renderer.renderSidebar(phases, mods, allQuestData);
    renderer.updateSidebarActive(modId);
    renderer.updateTotalStats(allQuestData);
  });

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

function setupSearch() {
  const input = document.getElementById('searchInput');
  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      if (query.length < 2) {
        renderer.hideSearchResults();
        return;
      }
      const results = search(query);
      renderer.renderSearchResults(results, query);
    }, 200);
  });

  // Hide results on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search')) {
      renderer.hideSearchResults();
    }
  });

  // Show results again on focus if there's a query
  input.addEventListener('focus', () => {
    const query = input.value.trim();
    if (query.length >= 2) {
      const results = search(query);
      renderer.renderSearchResults(results, query);
    }
  });
}

function setupSidebarToggle() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// Start the app
init().catch(err => {
  console.error('App initialization failed:', err);
  const loading = document.getElementById('loadingOverlay');
  if (loading) {
    loading.innerHTML = `
      <div style="color:var(--danger);padding:2rem;text-align:center;">
        <div style="font-size:3rem;margin-bottom:1rem;">⚠️</div>
        <h3>Oeps! Er ging iets mis.</h3>
        <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-secondary)">${err.message}</p>
        <button onclick="location.reload()" style="margin-top:1.5rem;padding:0.6rem 1.2rem;background:var(--accent);border:none;border-radius:var(--radius);cursor:pointer;font-weight:600;">Opnieuw proberen</button>
      </div>
    `;
  }
});
