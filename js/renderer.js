import * as state from './state.js';
import { getPrerequisites, getUnlocks } from './dependencies.js';

let onModSelect = null;

export function setModSelectHandler(handler) {
  onModSelect = handler;
}

// === Sidebar ===

export function renderSidebar(phases, mods, allQuestData) {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = '';

  for (const phase of phases) {
    const phaseMods = mods.filter(m => m.phase === phase.id);
    const group = document.createElement('div');
    group.className = 'phase-group';

    // Phase header
    const header = document.createElement('div');
    header.className = 'phase-header' + (state.isPhaseCollapsed(phase.id) ? ' collapsed' : '');

    // Calculate phase progress
    let phaseDone = 0, phaseTotal = 0;
    for (const mod of phaseMods) {
      const stats = state.getModCompletionStats(allQuestData[mod.id]);
      phaseDone += stats.done;
      phaseTotal += stats.total;
    }

    header.innerHTML = `
      <span class="phase-arrow">▼</span>
      <span class="phase-dot" style="background:${phase.color}"></span>
      <span>${phase.name}</span>
      <span class="phase-progress">${phaseDone}/${phaseTotal}</span>
    `;
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      state.togglePhaseCollapse(phase.id);
    });

    // Mod list
    const modList = document.createElement('div');
    modList.className = 'phase-mods';

    for (const mod of phaseMods) {
      const stats = state.getModCompletionStats(allQuestData[mod.id]);
      const pct = stats.total > 0 ? Math.round(stats.done / stats.total * 100) : 0;

      const item = document.createElement('div');
      item.className = 'mod-item' + (state.getActiveMod() === mod.id ? ' active' : '');
      item.dataset.modId = mod.id;

      let statusClass = '';
      let statusContent = '';
      if (pct === 100) {
        statusClass = 'complete';
        statusContent = '✓';
      } else if (pct > 0) {
        statusClass = 'partial';
      }

      item.innerHTML = `
        <span class="mod-status ${statusClass}">${statusContent}</span>
        <span class="mod-name">${mod.name}</span>
        <span class="mod-pct">${stats.total > 0 ? pct + '%' : ''}</span>
      `;

      item.addEventListener('click', () => {
        if (onModSelect) onModSelect(mod.id);
      });

      modList.appendChild(item);
    }

    // Set initial max-height for animation
    if (!state.isPhaseCollapsed(phase.id)) {
      requestAnimationFrame(() => {
        modList.style.maxHeight = modList.scrollHeight + 'px';
      });
    } else {
      modList.style.maxHeight = '0';
    }

    group.appendChild(header);
    group.appendChild(modList);
    nav.appendChild(group);
  }
}

export function updateSidebarActive(modId) {
  document.querySelectorAll('.mod-item').forEach(el => {
    el.classList.toggle('active', el.dataset.modId === modId);
  });
}

// === Welcome Screen ===

export function renderWelcome(phases, mods) {
  const container = document.getElementById('welcomePhases');
  container.innerHTML = '';

  for (const phase of phases) {
    const count = mods.filter(m => m.phase === phase.id).length;
    const card = document.createElement('div');
    card.className = 'welcome-phase-card';
    card.style.borderLeftColor = phase.color;
    card.innerHTML = `
      <h3 style="color:${phase.color}">${phase.name}</h3>
      <p>${phase.description}</p>
      <p style="margin-top:0.3rem;font-size:0.75rem;color:var(--text-muted)">${count} mods</p>
    `;
    container.appendChild(card);
  }
}

// === Mod View ===

export function renderModView(mod, questData, onStepToggle) {
  const modView = document.getElementById('modView');
  const welcomeScreen = document.getElementById('welcomeScreen');

  welcomeScreen.hidden = true;
  modView.hidden = false;

  // Header
  document.getElementById('modTitle').textContent = mod.name;
  document.getElementById('modDescription').textContent = mod.shortDescription;

  // Dependencies
  renderDependencies(mod.id);

  // Progress
  updateModProgress(questData);

  // Sections
  const container = document.getElementById('questSections');
  container.innerHTML = '';

  if (!questData || !questData.sections) {
    container.innerHTML = '<p style="color:var(--text-muted);padding:2rem;text-align:center">Quest data wordt nog geladen...</p>';
    return;
  }

  for (const section of questData.sections) {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'quest-section';

    // Section progress
    let secDone = 0;
    for (const step of section.steps) {
      if (state.isStepComplete(step.id)) secDone++;
    }

    // Section header
    const headerEl = document.createElement('div');
    headerEl.className = 'section-header' + (state.isSectionCollapsed(section.id) ? ' collapsed' : '');
    headerEl.innerHTML = `
      <span class="section-arrow">▼</span>
      <span class="section-title">${section.title}</span>
      <span class="section-progress">${secDone}/${section.steps.length}</span>
    `;
    headerEl.addEventListener('click', () => {
      headerEl.classList.toggle('collapsed');
      state.toggleSectionCollapse(section.id);
      
      // Toggle steps visibility
      const stepsEl = headerEl.nextElementSibling;
      if (headerEl.classList.contains('collapsed')) {
        stepsEl.style.maxHeight = stepsEl.scrollHeight + 'px'; // Start from current height
        requestAnimationFrame(() => {
          stepsEl.style.maxHeight = '0';
        });
      } else {
        stepsEl.style.maxHeight = stepsEl.scrollHeight + 'px';
        // Clear maxHeight after transition to allow for dynamic height changes (e.g. details expansion)
        setTimeout(() => {
          if (!headerEl.classList.contains('collapsed')) {
            stepsEl.style.maxHeight = 'none';
          }
        }, 310);
      }
    });

    // Steps container
    const stepsEl = document.createElement('div');
    stepsEl.className = 'section-steps';

    for (const step of section.steps) {
      const isComplete = state.isStepComplete(step.id);
      const stepEl = document.createElement('div');
      stepEl.className = 'quest-step' + (isComplete ? ' completed' : '');
      stepEl.dataset.stepId = step.id;

      let html = `
        <input type="checkbox" class="step-checkbox" ${isComplete ? 'checked' : ''} data-step-id="${step.id}">
        <div class="step-content">
          <div class="step-text">${step.text}</div>
      `;

      if (step.details) {
        html += `<div class="step-details">${step.details}</div>`;
      }

      if (step.items && step.items.length > 0) {
        html += '<div class="step-items">';
        for (const item of step.items) {
          html += `<span class="step-item-tag">${item}</span>`;
        }
        html += '</div>';
      }

      if (step.tip) {
        html += `<div class="step-tip">${step.tip}</div>`;
      }

      html += '</div>';
      stepEl.innerHTML = html;

      // Checkbox handler
      const checkbox = stepEl.querySelector('.step-checkbox');
      checkbox.addEventListener('change', () => {
        const nowComplete = state.toggleStep(step.id);
        stepEl.classList.toggle('completed', nowComplete);

        // Pulse animation
        checkbox.classList.add('just-checked');
        setTimeout(() => checkbox.classList.remove('just-checked'), 300);

        // Update progress displays
        updateModProgress(questData);
        updateSectionProgress(section, sectionEl);
        if (onStepToggle) onStepToggle();
      });

      stepsEl.appendChild(stepEl);
    }

    // Set initial max-height
    if (!state.isSectionCollapsed(section.id)) {
      requestAnimationFrame(() => {
        stepsEl.style.maxHeight = stepsEl.scrollHeight + 'px';
      });
    } else {
      stepsEl.style.maxHeight = '0';
    }

    sectionEl.appendChild(headerEl);
    sectionEl.appendChild(stepsEl);
    container.appendChild(sectionEl);
  }
}

function updateModProgress(questData) {
  const stats = state.getModCompletionStats(questData);
  const pct = stats.total > 0 ? (stats.done / stats.total * 100) : 0;
  document.getElementById('modProgressFill').style.width = pct + '%';
  document.getElementById('modProgressText').textContent = `${stats.done}/${stats.total}`;
}

function updateSectionProgress(section, sectionEl) {
  let done = 0;
  for (const step of section.steps) {
    if (state.isStepComplete(step.id)) done++;
  }
  const progEl = sectionEl.querySelector('.section-progress');
  if (progEl) progEl.textContent = `${done}/${section.steps.length}`;
}

// === Dependencies ===

function renderDependencies(modId) {
  const container = document.getElementById('modDependencies');
  const reqSection = document.getElementById('depRequires');
  const unlSection = document.getElementById('depUnlocks');
  const reqLinks = document.getElementById('depRequiresLinks');
  const unlLinks = document.getElementById('depUnlocksLinks');

  const prereqs = getPrerequisites(modId);
  const unlocks = getUnlocks(modId);

  const hasAny = prereqs.length > 0 || unlocks.length > 0;
  container.hidden = !hasAny;

  // Prerequisites
  reqSection.hidden = prereqs.length === 0;
  reqLinks.innerHTML = '';
  for (const dep of prereqs) {
    const link = document.createElement('span');
    link.className = 'dep-link';
    link.textContent = dep.modName;
    link.title = dep.reason;
    link.addEventListener('click', () => {
      if (onModSelect) onModSelect(dep.modId);
    });
    reqLinks.appendChild(link);
  }

  // Unlocks
  unlSection.hidden = unlocks.length === 0;
  unlLinks.innerHTML = '';
  for (const dep of unlocks) {
    const link = document.createElement('span');
    link.className = 'dep-link';
    link.textContent = dep.modName;
    link.title = dep.reason;
    link.addEventListener('click', () => {
      if (onModSelect) onModSelect(dep.modId);
    });
    unlLinks.appendChild(link);
  }
}

// === Total Stats ===

export function updateTotalStats(allQuestData) {
  const stats = state.getTotalStats(allQuestData);
  document.getElementById('totalProgress').textContent = `${stats.done}/${stats.total}`;
}

// === Search Results ===

export function renderSearchResults(results, query) {
  const container = document.getElementById('searchResults');

  if (results.length === 0) {
    container.innerHTML = '<div class="search-result-item"><span class="search-result-text">Geen resultaten gevonden</span></div>';
    container.classList.add('active');
    return;
  }

  container.innerHTML = '';
  for (const result of results) {
    const item = document.createElement('div');
    item.className = 'search-result-item';

    const highlighted = highlightMatch(result.text, query);

    item.innerHTML = `
      <div class="search-result-mod">${result.modName}</div>
      <div class="search-result-text">${highlighted}</div>
    `;

    item.addEventListener('click', () => {
      if (onModSelect) onModSelect(result.modId);
      container.classList.remove('active');
      document.getElementById('searchInput').value = '';

      // Scroll to step if applicable
      if (result.stepId) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const stepEl = document.querySelector(`[data-step-id="${result.stepId}"]`);
            if (stepEl) {
              stepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              stepEl.style.background = 'var(--bg-hover)';
              setTimeout(() => { stepEl.style.background = ''; }, 2000);
            }
          }, 100);
        });
      }
    });

    container.appendChild(item);
  }
  container.classList.add('active');
}

export function hideSearchResults() {
  document.getElementById('searchResults').classList.remove('active');
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
