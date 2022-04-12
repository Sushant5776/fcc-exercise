const { Schema, model } = require('mongoose')

const ExerciseSchema = Schema({
	username: { type: String, required: true },
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: { type: Date, default: Date.now() }
})


module.exports = model('Exercise', ExerciseSchema)