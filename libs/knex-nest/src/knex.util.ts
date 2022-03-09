export function getOptionToken(configTag = 'default'): string {
  return configTag + '_options';
}

export function getConnectionToken(configTag = 'default'): string {
  return configTag;
}
