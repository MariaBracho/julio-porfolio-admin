import { v4 as uuidv4 } from "uuid";

export const formatFileName = (fileName:string) => {
  return `${uuidv4()}-${fileName}`.replace(" ", "-");
};
