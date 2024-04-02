import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { type CategoryForm, categorySchema } from "./categorySchema";

import type { Category } from "../types/category";

export default function useCategoryForm(category?: Category | null) {
  return useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
    },
  });
}
