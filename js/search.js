let searchIndex = [];

export function buildSearchIndex(mods, allQuestData) {
  searchIndex = [];
  for (const mod of mods) {
    // Add mod itself as searchable
    searchIndex.push({
      type: 'mod',
      modId: mod.id,
      modName: mod.name,
      text: mod.name,
      subtext: mod.shortDescription
    });

    const quest = allQuestData[mod.id];
    if (!quest) continue;

    for (const section of quest.sections) {
      for (const step of section.steps) {
        searchIndex.push({
          type: 'step',
          modId: mod.id,
          modName: mod.name,
          stepId: step.id,
          sectionId: section.id,
          text: step.text,
          subtext: step.details || '',
          items: step.items || []
        });
      }
    }
  }
}

export function search(query) {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const results = [];

  for (const entry of searchIndex) {
    let score = 0;

    // Check main text
    if (entry.text.toLowerCase().includes(q)) {
      score += entry.type === 'mod' ? 100 : 50;
    }

    // Check subtext
    if (entry.subtext && entry.subtext.toLowerCase().includes(q)) {
      score += 20;
    }

    // Check items
    if (entry.items) {
      for (const item of entry.items) {
        if (item.toLowerCase().includes(q)) {
          score += 30;
          break;
        }
      }
    }

    if (score > 0) {
      results.push({ ...entry, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 20);
}
