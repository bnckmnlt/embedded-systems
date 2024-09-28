import { fetchVibrationRecords } from "$/server/actions/actions";
import { useQuery } from "@tanstack/react-query";

export function useGetVibrationRecords() {
  return useQuery({
    queryKey: ["vibration"],
    queryFn: async () => fetchVibrationRecords(),
  });
}
