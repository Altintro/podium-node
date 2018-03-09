"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const gameSchema = Schema({
    name: { type: String, default: "" },
    sport: { type: Schema.Types.ObjectId, ref: 'Sport' },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    wins: { type: Schema.Types.ObjectId, ref: 'Team' },
    loses: { type: Schema.Types.ObjectId, ref: 'Team' },
    concluded: Boolean,
    date: Date
})

var Game = mongoose.model ('Game', gameSchema)
module.exports = Game