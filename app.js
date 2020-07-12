const { makeAugmentedSchema } = require("neo4j-graphql-js");
const { ApolloServer } = require("apollo-server");
require("dotenv").config();
const neo4j = require("neo4j-driver");
const typeDefs = require("./schema")

const schema = makeAugmentedSchema({ typeDefs });

const driver = neo4j.driver(
  process.env.DB_HOST,
  neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASS)
);

const server = new ApolloServer({ schema, context: { driver } });

server.listen(3003).then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});
