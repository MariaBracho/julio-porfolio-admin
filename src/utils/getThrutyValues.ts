export function getThrutyValues(
  obj: Record<string, unknown>,
  ignoreKeys: string[] = []
) {
  return Object.keys(obj).reduce(
    (acc: Record<string, unknown>, key: string) => {
      if (
        !ignoreKeys.includes(key) &&
        obj[key] !== undefined &&
        obj[key] !== null
      ) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {}
  );
}
