/**
 * Simplifies a string (trims and lowerCases)
 */
export function simplify(s: string): string {
  return `${s}`.trim().toLowerCase();
}

/**
 * Transforms a camelCase string into a readable text format
 * @example textify('helloWorld!')
 * // Hello world!
 */
export function textify(text: string) {
  return text
    .replace(/([A-Z])/g, (char) => ` ${char.toLowerCase()}`)
    .replace(/^([a-z])/, (char) => char.toUpperCase());
}

/**
 * Transforms a text string into a title case text format
 * @example titleCase('hello world!')
 * // Hello World!
 */
export function titleCase(value: string) {
  const sentence = value.toLowerCase().split(" ");
  for (let i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(" ");
}
