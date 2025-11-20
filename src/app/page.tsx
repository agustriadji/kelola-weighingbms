import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<p className="text-center">Loading Page...</p>}>
    </Suspense>
  );
}