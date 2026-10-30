import { useQuery } from "@tanstack/react-query";
import type { Descriptor } from "@/lib/api";
import { fetchDescriptors } from "@/lib/api";

export type DescriptorsState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; descriptors: Descriptor[] };

export function useDescriptors() {
  const query = useQuery({ queryKey: ["descriptors"], queryFn: fetchDescriptors, staleTime: Infinity, retry: 1 });

  let state: DescriptorsState = { status: "loading" };
  if (query.data) state = { status: "ready", descriptors: query.data };
  else if (query.isError && !query.isFetching) state = { status: "failed" };

  return { state, retry: () => query.refetch() };
}
