import { neon } from "@neondatabase/serverless"

type DatabaseRow = Record<string, unknown>

export type DatabaseClient = {
  readonly isConfigured: boolean
  query<Row extends DatabaseRow = DatabaseRow>(
    statement: string,
    parameters?: unknown[],
  ): Promise<Row[]>
}

function createDatabaseClient(connectionString?: string): DatabaseClient {
  if (!connectionString) {
    return {
      isConfigured: false,
      async query() {
        return []
      },
    }
  }

  let sql: ReturnType<typeof neon>
  try {
    const url = new URL(connectionString)
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
      throw new Error("DATABASE_URL must use postgres or postgresql.")
    }
    sql = neon(connectionString)
  } catch {
    return {
      // A supplied but invalid value is a configuration error, not the
      // intentional no-database fallback.
      isConfigured: true,
      async query() {
        throw new Error("DATABASE_URL is invalid.")
      },
    }
  }

  return {
    isConfigured: true,
    async query<Row extends DatabaseRow = DatabaseRow>(
      statement: string,
      parameters: unknown[] = [],
    ) {
      const rows = await sql.query(statement, parameters, {
        fetchOptions: {
          signal: AbortSignal.timeout(3_000),
        },
      })
      return rows as Row[]
    },
  }
}

export const db = createDatabaseClient(process.env.DATABASE_URL?.trim())
