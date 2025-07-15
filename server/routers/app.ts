import { createContext } from "../context";
import { createCallerFactory, router } from "../trpc";
import { projectRouter } from "./project";

export const appRouter = router({
  project: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};
