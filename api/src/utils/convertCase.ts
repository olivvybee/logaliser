export const toKebabCase = (str: string) =>
  str
    .split('')
    .map((letter) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }
      return letter;
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-');

export const toSentenceCase = (str: string) => {
  const kebabCase = toKebabCase(str).replace(/-/g, ' ');
  return kebabCase.slice(0, 1).toUpperCase() + kebabCase.slice(1);
};

export const toCamelCase = (str: string) => {
  return toKebabCase(str)
    .split('-')
    .map((word, index) => {
      if (index === 0) return word;
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};
