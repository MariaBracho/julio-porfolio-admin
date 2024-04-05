import { STORAGE_KEYS } from "@/constants/storageKeys";
import { formatFileName } from "@/utils/formatFileName";
import { getFileNameFromUrl } from "@/utils/getFileNameFromUrl";
import { getPublicUrlFromFile } from "@/utils/getPublicUrlFromFile";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";

export default function useProjectStorage (){

    const client = useSupabaseBrowser();

    const { PROJECTS } = STORAGE_KEYS;
  
    const query = client.storage.from(PROJECTS);
  
    const { mutateAsync: upload } = useUpload(query, {
      buildFileName: ({ fileName }) => formatFileName(fileName),
    });
  
    const removeFiles = async (files: string[] | null ) => {
      if (!files) return;
      const paths= files.map((file)=> `${getFileNameFromUrl(file)}`)
      return await query.remove(paths);
    };

    const uploadFiles = async ({img, icon}:{img:File, icon:File}) => {
        const [imgPath, iconPath]= await upload({files: [img, icon]});

        const urlImg = getPublicUrlFromFile(imgPath, query);
        const urlIcon = getPublicUrlFromFile(iconPath, query);

        return {urlImg, urlIcon}
    }

    const updateFiles = async ({imgFile, iconFile}:{imgFile:File | null, iconFile:File | null}) => {
        let urlImg = null;
        let urlIcon = null;
       
        if(imgFile){
            const [imgPath] = await upload({files: [imgFile]});
            urlImg = getPublicUrlFromFile(imgPath, query);
        }
        if(iconFile){
            const [iconPath] = await upload({files: [iconFile]});
            urlIcon = getPublicUrlFromFile(iconPath, query);
        }

    
        return {urlImg, urlIcon}
    }




    return {removeFiles, uploadFiles, updateFiles}
}