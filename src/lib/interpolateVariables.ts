export type Variable = {
  id: string;
  key: string;
  value: string;
};

export function interpolateVariables(
  text: string,
  variables: Variable[],
): string {
  return variables.reduce((acc, variable) => {
    const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
    return acc.replace(regex, variable.value);
  }, text);
}

export function interpolateData<
  T extends Record<PropertyKey, string | undefined>,
>(
  url: string = '',
  body: string | object | undefined = '',
  headers: T,
  variables: Variable[],
): {
  url: string;
  body: string;
  headers: Record<keyof T, string>;
} {
  const interpolatedUrl = interpolateVariables(url, variables);
  const stringifyBody =
    typeof body === 'string' ? body : JSON.stringify(body || '');
  const interpolatedBody = interpolateVariables(stringifyBody, variables);
  const interpolatedHeaders = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [
      k,
      interpolateVariables(v ?? '', variables),
    ]),
  ) as Record<keyof T, string>;

  return {
    url: interpolatedUrl,
    body: interpolatedBody,
    headers: interpolatedHeaders,
  };
}
