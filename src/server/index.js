const Fastify = require('fastify')
const cors = require('@fastify/cors')
const mercurius = require('mercurius')
const { PrismaClient } = require('@prisma/client')

const app = Fastify()
const prisma = new PrismaClient()

const schema = `
  type Post {
    id: Int
    title: String
    url: String
  }
  type Query {
    getPosts: [Post]
    searchPosts(term: String): [Post]
  }
  type Mutation {
    post(title: String!, url: String!): Post
  }
`

const resolvers = {
  Query: {
    getPosts: async (_parent, args, context) => {
      return context.prisma.post.findMany();
    },
    searchPosts: async (_parent, args, context) => {
      const result = await prisma.post.findMany({
        where: { title: args.term },
      })
      return result;
    }
  },
  Mutation: {
    post: async (_parent, args, context) => {
      return context.prisma.post.create({
        data: {
          title: args.title,
          url: args.url
        }
      })
    },
  }
}

async function createServer() {
  await app.register(mercurius, {
    schema,
    resolvers,
    context: (request, reply) => {
      return { prisma }
    },
    graphiql: true,
  })

  await app.register(cors, {
    origin: 'http://localhost:3000'
  })

  await app.listen(3001)
    .then(() => console.log(`🚀 Server ready at http://localhost:3001/graphiql`))

  return app
}

createServer();
