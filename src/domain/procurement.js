const TASK_TERMS = {
  supplier: ['supplier', '供应商', '制造商', '零部件', '配套', 'oem', 'tier'],
  technology: ['technology', '技术', '研发', 'innovation', '创新', '测试', '验证'],
  cost: ['material', '材料', '工艺', '轻量化', 'manufacturing', '制造', 'localization', '本地化'],
  qualification: ['testing', '测试', 'validation', '验证', 'certification', '认证', 'quality', '质量', 'safety', '安全', '法规'],
  aftermarket: ['aftermarket', '售后', '维修', 'remanufacturing', '再制造', 'recycling', '回收', '配件', '渠道']
};

const haystack = (values) => values.filter(Boolean).join(' ').toLowerCase();

export function getProcurementEventMatch(event, assembly, taskId) {
  const eventKeywords = haystack(event.matching?.keywords || []);
  const assemblyKeywords = assembly.keywords || [];
  const keywordMatches = assemblyKeywords.filter((keyword) => eventKeywords.includes(keyword.toLowerCase()));
  const categoryMatch = assembly.categoryIds.includes(event.taxonomy.categoryId) || (event.matching?.categories || []).some((id) => assembly.categoryIds.includes(id));
  const taskEvidence = (TASK_TERMS[taskId] || []).filter((term) => eventKeywords.includes(term.toLowerCase()));
  const precise = keywordMatches.length > 0 && (categoryMatch || taskEvidence.length > 0);
  return { event, categoryMatch, keywordMatches, taskEvidence, precise, score: keywordMatches.length * 5 + taskEvidence.length * 3 + (categoryMatch ? 4 : 0) };
}

export function getProcurementAssemblyEvents(events, assembly, taskId) {
  const matches = events.map((event) => getProcurementEventMatch(event, assembly, taskId));
  const precise = matches.filter((match) => match.precise);
  return precise.length ? precise : matches.filter((match) => match.categoryMatch && match.taskEvidence.length > 0);
}

export function rankProcurementEvents(matches) {
  return [...matches].sort((left, right) => right.score - left.score || left.event.date.sortDate - right.event.date.sortDate);
}
