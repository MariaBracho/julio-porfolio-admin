import { STORAGE_KEYS } from "@/constants/storageKeys";
import { formatFileName } from "@/utils/formatFileName";
import { getFileNameFromUrl } from "@/utils/getFileNameFromUrl";
import { getPublicUrlFromFile } from "@/utils/getPublicUrlFromFile";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";

export default function useCertificatesStorage(){
    const {CERTIFICATES}= STORAGE_KEYS;

    const client = useSupabaseBrowser();

    const query = client.storage.from(CERTIFICATES);

    const { mutateAsync: upload } = useUpload(query, {
        buildFileName: ({ fileName }) => formatFileName(fileName),
      });
    
    
    const uploadCertificate = async (certificate: FileList | null) => {
     
        if (!certificate) return []

        const files =await upload(
         {
           files: certificate,
         }
       );

       const paths = files.filter((file)=> Boolean(file.data?.path))
   
       return paths.map((file)=> ({img: getPublicUrlFromFile(file, query) as string})) as Record<string, unknown>[];
    };
    
    const removeCertificate = async (path: string | null) => {
        if (!path) return;
        return await query.remove([`${getFileNameFromUrl(path)}`]);
    };

    const updatedCertificate = async ({
        lastFile,
        newFile,
      }: {
        lastFile: string | null;
        newFile: File;
      }) => {
        const [ file ]= await upload(
          {
            files: [newFile],
          },
          {
            onSuccess: async () => {
              await removeCertificate(lastFile);
            },
          }
        );
    
        return getPublicUrlFromFile(file, query);
      };
    
    
    return {
        uploadCertificate,
         removeCertificate,
        updatedCertificate,
    };
    }