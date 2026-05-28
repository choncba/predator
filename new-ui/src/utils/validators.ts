export const isTestValid = (test: unknown): boolean => {
  if (!test || typeof test !== 'object') return false;
  const t = test as Record<string, unknown>;
  return !!(t.artillery_test && t.name && t.type);
};
