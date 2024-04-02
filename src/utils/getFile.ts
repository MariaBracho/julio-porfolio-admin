export const getFile = (
  event: React.ChangeEvent<HTMLInputElement>
): File | null => {
  const file = event.target.files?.[0];

  if (!file) return null;

  return file;
};
