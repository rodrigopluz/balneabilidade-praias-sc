export function normalizeKey(title: string): string {
  const key = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/&([a-z])[a-z]+;/gi, '$1')
    .toLowerCase();
  return key;
}

export function validateMunicipioId(id: string | number): boolean {
  const strId = String(id);
  return /^\d+$/.test(strId) && strId.length > 0;
}

export function validateYear(year: string | number | undefined): boolean {
  if (year === undefined) return true;
  const strYear = String(year);
  return /^\d{4}$/.test(strYear);
}

export function parseEcoliValue(value: string): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

export function getBathingCondition(ecoli: number): 'PRÓPRIA' | 'IMPRÓPRIA' {
  return ecoli <= 800 ? 'PRÓPRIA' : 'IMPRÓPRIA';
}
