import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type RecommendationsForm, recommendationsSchema, recommendationsEditSchema } from "./recommendationsSchema";
import type { Recommendations } from "@/features/recommendations/types/recommendations";

export default function useRecommendationsForm(recommendationData: Recommendations | null) {
  const schema= recommendationData? recommendationsEditSchema: recommendationsSchema;
  
  return useForm<RecommendationsForm>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      username: recommendationData?.username ?? "",
      role: recommendationData?.role ?? "",
      description: recommendationData?.description ?? "",
      profilePicture: ''
    },
  });
}
