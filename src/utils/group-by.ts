export function groupBy<K extends string, T>(list: T[], keyMap: (obj: T) => K): Record<K, T[]> {
  return list.reduce((prev: any, current) => {
    const key = keyMap(current);

    return {
      ...prev,
      [key]: [...(prev[key] || []), current]
    }
  }, {});
}
