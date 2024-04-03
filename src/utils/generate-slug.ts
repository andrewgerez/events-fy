export function generateSlug(text: string): string {
  return text
      .normalize('NFD')
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-');
}
