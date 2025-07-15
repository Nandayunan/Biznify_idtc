import { router } from "../trpc";
import { projectRouter } from "./project";

export const appRouter = router({
  project: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
