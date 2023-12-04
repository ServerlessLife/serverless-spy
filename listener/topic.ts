export const SSPY_TOPIC = 'sspy';

export function getTopic(scope: string) {
  return `${SSPY_TOPIC}/${scope}`;
}
