import { v4 as uuidv4 } from "uuid";


export const formatFileName = (fileName:string) => {
  const data= `${uuidv4()}-${fileName}`;
  return encodeURIComponent(data).replaceAll('%', '-').toLowerCase();
}


