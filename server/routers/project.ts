import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "@/lib/db";
import { project as projectTable } from "@/lib/drizzle/schema/project";
import { randomUUID } from "crypto";
import { withAuth } from "@/server/with-auth";
import { eq } from "drizzle-orm";

export const projectRouter = router({
  create: procedure
    .use(withAuth)
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = randomUUID();
      const [created] = await db
        .insert(projectTable)
        .values({
          id,
          userId: ctx.session.user.id,
          title: input.title,
        })
        .returning();
      return created;
    }),
  getById: procedure
    .use(withAuth)
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const projects = await db
        .select()
        .from(projectTable)
        .where(eq(projectTable.id, input.id));
      return projects[0] ?? null;
    }),
});
