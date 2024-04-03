import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import type { Category } from "@/features/categories/types/category";

import { type CategoryForm, categorySchema, editCategorySchema } from "./categorySchema";

export default function useCategoryForm(category?: Category | null) {
  const schema= category? editCategorySchema: categorySchema

  return useForm<CategoryForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
      icon: ''
    },
  });
}
