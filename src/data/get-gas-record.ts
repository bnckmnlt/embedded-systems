import { fetchSingleGasRecord, Gas } from "$/server/actions/actions";
import { useQuery } from "@tanstack/react-query";

export function useGetSingleGasRecord() {
  return useQuery({
    queryKey: ["gas"],
    queryFn: async () => fetchSingleGasRecord(),
  });
}
