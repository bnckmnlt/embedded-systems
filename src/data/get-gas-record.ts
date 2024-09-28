import { fetchSingleGasRecord, Gas } from "$/server/actions/actions";
import { useQuery } from "@tanstack/react-query";
import Error from "next/error";

export function useGetSingleGasRecord(): Promise<Gas, Error> {
  return useQuery({
    queryKey: ["gas"],
    queryFn: async () => fetchSingleGasRecord(),
  });
}
