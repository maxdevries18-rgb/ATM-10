let edges = [];
let modsMap = {};

export function loadDependencies(depsData, mods) {
  edges = depsData.edges || [];
  modsMap = {};
  for (const mod of mods) {
    modsMap[mod.id] = mod;
  }
}

export function getPrerequisites(modId) {
  return edges
    .filter(e => e.to === modId)
    .map(e => ({
      modId: e.from,
      modName: modsMap[e.from]?.name || e.from,
      reason: e.reason
    }));
}

export function getUnlocks(modId) {
  return edges
    .filter(e => e.from === modId)
    .map(e => ({
      modId: e.to,
      modName: modsMap[e.to]?.name || e.to,
      reason: e.reason
    }));
}
