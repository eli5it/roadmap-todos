import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchUser() {
  try {
    const { data } = await axios.get("/api/auth/me");
    return data;
  } catch (error) {
    return null;
  }
}

export function useAuth() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
