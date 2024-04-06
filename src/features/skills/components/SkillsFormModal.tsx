import { type Dispatch, type SetStateAction } from "react";

import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import FormModal from "@/components/modals/FormModal";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toastMessage";

import { Skill } from "@/features/skills/types/skills";
import useSkillForm from "@/features/skills/form/useSkillForm";
import {
  useCreateSKills,
  useUpdateSKills,
} from "@/features/skills/queries/skillsQueries";

import { SkillsForm } from "@/features/skills/form/skillSchema";

interface Props {
  isEdit: boolean;
  data: Skill | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SkillFormModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const title = isEdit ? "Editar skill" : "Crear skill";

  const form = useSkillForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateSKills();

  const { mutateAsync: update, isPending: isPedingUpdate } = useUpdateSKills();

  const onSubmit: SubmitHandler<SkillsForm> = async (values) => {
    if (isEdit && data) {
      await update(
        { ...values, id: data.id },
        {
          onSuccess: async () => {
            toast.success(TOAST_MESSAGES.DATA_SAVED);
            setOpen(false);
          },
        }
      );
      return;
    }

    await insert([values], {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <FormModal
      formProps={form}
      onSubmit={handleSubmit(onSubmit)}
      title={title}
      onOpenChange={setOpen}
      open={open}
      isLoading={isPending || isPedingUpdate}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skill</FormLabel>
            <FormControl>
              <Input className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormModal>
  );
}
