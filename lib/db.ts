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

  const sql = neon(connectionString)

  return {
    isConfigured: true,
    async query<Row extends DatabaseRow = DatabaseRow>(
      statement: string,
      parameters: unknown[] = [],
    ) {
      const rows = await sql.query(statement, parameters)
      return rows as Row[]
    },
  }
}

export const db = createDatabaseClient(process.env.DATABASE_URL?.trim())
