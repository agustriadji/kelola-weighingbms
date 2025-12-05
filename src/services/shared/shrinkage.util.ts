export const calculateShrinkage = (expected: number, actual: number) => {
  if (!expected || !actual) {
    return {
      shrinkageValue: 0,
      shrinkagePercent: 0,
      warning: false,
    };
  }

  const diff = expected - actual;
  const percent = (diff / expected) * 100;

  return {
    shrinkageValue: diff,
    shrinkagePercent: percent,
    warning: percent > 0.2, // 0.2% threshold
  };
};
