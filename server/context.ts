import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createContext = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const ctx = {
    session,
  };

  return ctx;
};

export type Context = typeof createContext;
