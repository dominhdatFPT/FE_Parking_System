export function formatDate(value: string | Date, locale = 'vi-VN') {
  return new Intl.DateTimeFormat(locale).format(new Date(value));
}
