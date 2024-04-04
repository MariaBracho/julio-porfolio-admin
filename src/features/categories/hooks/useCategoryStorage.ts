import { STORAGE_KEYS } from "@/constants/storageKeys";
import { formatFileName } from "@/utils/formatFileName";
import { getFileNameFromUrl } from "@/utils/getFileNameFromUrl";
import { getPublicUrlFromFile } from "@/utils/getPublicUrlFromFile";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";

export default function useCategoryStorage() {
  const client = useSupabaseBrowser();

  const { CATEGORIES } = STORAGE_KEYS;

  const query = client.storage.from(CATEGORIES);

  const { mutateAsync: upload } = useUpload(query, {
    buildFileName: ({ fileName }) => formatFileName(fileName),
  });

  const deleteIcon = async (icon: string | null) => {
    if (!icon) return;
    return await query.remove([`${getFileNameFromUrl(icon)}`]);
  };

  const updatedIcon = async ({
    lastIcon,
    newIcon,
  }: {
    lastIcon: string | null;
    newIcon: File;
  }) => {
    const [file] = await upload(
      {
        files: [newIcon],
      },
      {
        onSuccess: async () => {
            await deleteIcon(lastIcon);
        },
      }
    );

    return getPublicUrlFromFile(file, query);
  };

  const uploadIcon = async (icon: File | undefined) => {
    if (!icon) return;

    const [file] = await upload({
      files: [icon],
    });

    return getPublicUrlFromFile(file, query);
  };

  return { uploadIcon, updatedIcon, deleteIcon };
}
