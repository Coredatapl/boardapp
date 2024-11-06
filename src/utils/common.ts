export const targetInside = (
  target: EventTarget,
  element: HTMLElement
): boolean => {
  return element && element.contains(target as Node);
};

export const matchByWords = (
  words: string[],
  data: string[],
  withOrder: boolean = false,
  minLength: number = 3
): string[] => {
  const matchedData: { value: string; count: number }[] = [];
  for (const value of data) {
    const filtered = words.filter(
      (word) => word.length > minLength && value.indexOf(word) !== -1
    );

    if (filtered.length) {
      matchedData.push({ value, count: filtered.length });
    }
  }

  if (withOrder) {
    matchedData.sort((a, b) => b.count - a.count);
  }
  return matchedData.map((v) => v.value);
};
