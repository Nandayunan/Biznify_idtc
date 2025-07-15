import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import * as schema from "./drizzle/schema/auth-schema"
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        schema,
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
    enabled: true, 
    
  },
  plugins: [nextCookies()] 
});