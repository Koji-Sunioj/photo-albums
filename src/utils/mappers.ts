export const fileMapper = (file: File, i: number) => {
  return {
    name: file.name,
    type: file.type,
    file: file,
    blob: URL.createObjectURL(file),
    closed: true,
    text: null,
    order: i + 1,
  };
};
