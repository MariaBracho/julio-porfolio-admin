import { STORAGE_KEYS } from "@/constants/storageKeys";
import { formatFileName } from "@/utils/formatFileName";
import { getFileNameFromUrl } from "@/utils/getFileNameFromUrl";
import { getPublicUrlFromFile } from "@/utils/getPublicUrlFromFile";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";

export default function useRecommendationtorage() {
  const client = useSupabaseBrowser();

  const { REFERRAL_PROFILE_PICTURES } = STORAGE_KEYS;

  const query = client.storage.from(REFERRAL_PROFILE_PICTURES);

  const { mutateAsync: upload } = useUpload(query, {
    buildFileName: ({ fileName }) => formatFileName(fileName),
  });

  const deleteProfilePicture = async (icon: string | null) => {
    if (!icon) return;
    return await query.remove([`${getFileNameFromUrl(icon)}`]);
  };

  const updatedProfilePicture = async ({
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
          await deleteProfilePicture(lastIcon);
        },
      }
    );

    return getPublicUrlFromFile(file, query);
  };

  const uploadProfilePicture = async (icon: File | undefined) => {
    if (!icon) return;

    const [file] = await upload({
      files: [icon],
    });

    return getPublicUrlFromFile(file, query);
  };

  return { uploadProfilePicture, updatedProfilePicture, deleteProfilePicture };
}
