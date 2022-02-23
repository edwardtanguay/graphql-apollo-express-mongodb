import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import express from 'express';
import mongoose from 'mongoose';

const port = 4044;
const mongoURI = 'mongodb://localhost:27017/store';

const typeDefs = `
	type Query {
		customers(limit:Int): [Person]
	}

	type Person {
		firstName: String!
		lastName: String!
		email: String!
	}

	input CreateCustomerInput {
		firstName: String!
		lastName: String!
		email: String!
	}

	type Mutation {
		createCustomer(input: CreateCustomerInput): Person
	}
`;

const PersonSchema = new mongoose.Schema(
	{
		firstName: { type: String },
		lastName: { type: String },
		email: { type: String }
	},
	{ collection: 'persons', versionKey: false }
);

const Person = mongoose.model('Person', PersonSchema);

const resolvers = {
	Query: {
		customers: async (_, { limit }) => {
			return await Person.find().limit(limit);
		}
	},
	Mutation: {
		createCustomer: async (_, {input}) => {
			console.log(input);
			return await Person.create(input);
		}
	}
};

const app = express();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});

await server.start();

server.applyMiddleware({ app });

app.listen(port, () => console.log(`server is running on: http://localhost:${port}`));

try {
	await mongoose.connect(mongoURI);
	console.log('connected to database');
} catch (err) {
	console.log(err);
	process.exit(1);
}