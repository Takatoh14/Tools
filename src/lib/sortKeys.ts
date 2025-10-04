// src/lib/sortKeys.ts
/** オブジェクトのキーを再帰的にアルファベット順に並べ替え */
export function sortKeysDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(v => sortKeysDeep(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    const out: Record<string, unknown> = {};
    for (const k of sortedKeys) {
      out[k] = sortKeysDeep(obj[k]);
    }
    return out as unknown as T;
  }
  return value;
}
