import type { Config } from "drizzle-kit";


// broken
// https://github.com/drizzle-team/drizzle-orm/issues/781

export default {
    schema: './app/db/schema.ts',
    out: './drizzle-migrations/',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.POSTGRES_URL,
    }
} satisfies Config;