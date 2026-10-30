import { useEffect, useState } from "react";
import type { Descriptor } from "@/lib/api";
import { fetchDescriptors } from "@/lib/api";

export type DescriptorsState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; descriptors: Descriptor[] };

export function useDescriptors() {
  const [state, setState] = useState<DescriptorsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    fetchDescriptors()
      .then((descriptors) => {
        if (current) setState({ status: "ready", descriptors });
      })
      .catch(() => {
        if (current) setState({ status: "failed" });
      });
    return () => {
      current = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  };

  return { state, retry };
}
