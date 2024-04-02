import { v4 as uuidv4 } from "uuid";

export const formatFileName = (file: File) => {
  return `${uuidv4()}-${file.name}`.replace(" ", "-");
};
