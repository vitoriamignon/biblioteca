//import { PrismaClient } from '@prisma/client'
//import { createClient } from '@libsql/client'

// Client do Turso
//const turso = createClient({
//  url: process.env.DATABASE_URL!,
//  authToken: process.env.TURSO_AUTH_TOKEN,
//})

// Adaptador customizado
//class TursoPrismaClient extends PrismaClient {
//  constructor() {
//    super({
//     datasources: {
//        db: { url: process.env.DATABASE_URL }
//      },
//    })
//  }

  // Método para executar SQL direto
//  async executeRaw(sql: string, params: any[] = []) {
//    const result = await turso.execute({
//      sql,
//      args: params,
//    })
//    return result
//  }
//}

//export const prisma = new TursoPrismaClient()