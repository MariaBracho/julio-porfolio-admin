import type { StorageFileApi , UploadFileResponse} from "@supabase-cache-helpers/storage-react-query";

export const getPublicUrlFromFile = (file:UploadFileResponse, query: StorageFileApi)=>{
 
    if (!file.data?.path) return;

    const path = file.data?.path;

    const {
      data: { publicUrl },
    } = query.getPublicUrl(path);

    return publicUrl;
}