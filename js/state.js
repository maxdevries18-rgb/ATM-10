const PROGRESS_KEY = 'atm10-progress';
const UI_STATE_KEY = 'atm10-ui-state';

let progress = {};
let uiState = { activeMod: null, collapsedSections: [], collapsedPhases: [] };
let saveTimeout = null;

export function loadProgress() {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) progress = JSON.parse(data);
  } catch (e) {
    console.warn('Could not load progress:', e);
    progress = {};
  }
}

export function loadUIState() {
  try {
    const data = localStorage.getItem(UI_STATE_KEY);
    if (data) uiState = { ...uiState, ...JSON.parse(data) };
  } catch (e) {
    console.warn('Could not load UI state:', e);
  }
}

function saveProgress() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }, 300);
}

export function saveUIState() {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
  } catch (e) {
    console.warn('Could not save UI state:', e);
  }
}

export function isStepComplete(stepId) {
  return !!progress[stepId];
}

export function toggleStep(stepId) {
  progress[stepId] = !progress[stepId];
  saveProgress();
  return progress[stepId];
}

export function getActiveMod() {
  return uiState.activeMod;
}

export function setActiveMod(modId) {
  uiState.activeMod = modId;
  saveUIState();
}

export function isSectionCollapsed(sectionId) {
  return uiState.collapsedSections.includes(sectionId);
}

export function toggleSectionCollapse(sectionId) {
  const idx = uiState.collapsedSections.indexOf(sectionId);
  if (idx === -1) {
    uiState.collapsedSections.push(sectionId);
  } else {
    uiState.collapsedSections.splice(idx, 1);
  }
  saveUIState();
}

export function isPhaseCollapsed(phaseId) {
  return uiState.collapsedPhases.includes(phaseId);
}

export function togglePhaseCollapse(phaseId) {
  const idx = uiState.collapsedPhases.indexOf(phaseId);
  if (idx === -1) {
    uiState.collapsedPhases.push(phaseId);
  } else {
    uiState.collapsedPhases.splice(idx, 1);
  }
  saveUIState();
}

export function getModCompletionStats(questData) {
  if (!questData || !questData.sections) return { done: 0, total: 0 };
  let done = 0, total = 0;
  for (const section of questData.sections) {
    for (const step of section.steps) {
      total++;
      if (isStepComplete(step.id)) done++;
    }
  }
  return { done, total };
}

export function getTotalStats(allQuestData) {
  let done = 0, total = 0;
  for (const quest of Object.values(allQuestData)) {
    const stats = getModCompletionStats(quest);
    done += stats.done;
    total += stats.total;
  }
  return { done, total };
}

export function exportProgress() {
  return JSON.stringify(progress, null, 2);
}

export function importProgress(json) {
  try {
    const data = JSON.parse(json);
    progress = data;
    saveProgress();
    return true;
  } catch (e) {
    return false;
  }
}
