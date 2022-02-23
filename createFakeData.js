import mongoose from 'mongoose';
import faker from 'faker';

const mongoURI = 'mongodb://localhost:27017/store';

const PersonSchema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String },
},
	{
		collection: "persons", versionKey: false
	}
);

const Person = mongoose.model('Person', PersonSchema);

try {
	await mongoose.connect(mongoURI);
	console.log(`connected to database`);
} catch (err) {
	console.log(err);
	process.exit(1)
}

const persons = [];

for (let i = 1; i <= 20; i++) {
	const firstName = faker.name.firstName();
	const lastName = faker.name.lastName();
	const email = faker.internet.email(`${firstName} ${lastName}`);
	persons.push({
		firstName: firstName,
		lastName: lastName,
		email: email
	});
}

persons.forEach(person => Person.create(person));