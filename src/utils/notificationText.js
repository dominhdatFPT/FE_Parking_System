const EXACT_EN_TRANSLATIONS = new Map([
  ['thay doi tien gui', 'Parking fee update'],
  ['noi dung dang duoc cap nhat.', 'Content is being updated.'],
  ['noi dung dang duoc cap nhat', 'Content is being updated.'],
  ['cap nhat', 'Update'],
  ['thanh toan dang loi :))', 'Payment is currently having an issue :))'],
  ['thanh toan dang loi', 'Payment is currently having an issue.'],
]);

const PHRASE_EN_TRANSLATIONS = [
  [/thanh toan/gi, 'payment'],
  [/dang loi/gi, 'is currently having an issue'],
  [/dang duoc cap nhat/gi, 'is being updated'],
  [/cap nhat/gi, 'update'],
  [/tien gui/gi, 'parking fee'],
  [/thay doi/gi, 'change'],
];

function stripVietnamese(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function normalize(value) {
  return stripVietnamese(value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function translateNotificationText(value, language) {
  if (!value || !String(language || '').startsWith('en')) return value;

  const normalized = normalize(value);
  const exact = EXACT_EN_TRANSLATIONS.get(normalized);
  if (exact) return exact;

  let translated = stripVietnamese(value);
  for (const [pattern, replacement] of PHRASE_EN_TRANSLATIONS) {
    translated = translated.replace(pattern, replacement);
  }

  return translated === stripVietnamese(value) ? value : translated;
}
