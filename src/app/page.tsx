import { Suspense } from "react";
import { HomeExperience } from "@/components/experience/HomeExperience";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeExperience />
    </Suspense>
  );
}
