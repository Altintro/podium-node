'use_strict'
const Tournament = require('../models/Tournament')
const User = require('../models/User')
const Sport = require('../models/Sport')
const Team = require('../models/Team')

function mapBasicTournament(tournament) {
  return {
    _id: tournament.id,
    name: tournament.name,
    sport: tournament.sport,
    compType: tournament.compType,
    levelAverage: tournament.levelAverage,
    open: tournament.open,
    modality: tournament.modality
  }
}

exports.getTournaments = async (req, res, send) => {

  const limit = parseInt(req.query.limit)
  const fields = req.query.fields
  const sort = req.query.sort

  const filter = {}
  const name = req.query.name
  if(name) { filter.name = { $regex: '^'+name, $options: 'i' }}

  let tournaments = await Tournament.find(filter)
  .limit(limit)
  .sort(sort)
  .populate('sport')
  .exec()
  tournaments = tournaments.map(mapBasicTournament)
  return res.status(200).json({ results: tournaments })
}

exports.getTournament = async (req, res, next) => {

  let participants = req.query.participants ? 'participants' : ''
  const tournament = await Tournament.findById(req.params.id)
  .populate(participants)
  .exec()
  return res.status(200).json({ result: tournament })
}

exports.postTournament = async (req, res, send) => {

  const tournament = await Tournament.create({
    name: req.body.name,
    compType: req.body.compType
  })
  return res.status(200).json({ result: tournament })
}

exports.deleteTournament = async (req, res, next) => {

  const query = { _id: req.params.id }
  await Tournament.deleteOne(query)
  return res.status(200).json({ deleted: true })
}

exports.signUpTournament = async (req, res, send) => {

  let query = { _id: req.params.id }
  let operation = { $push: {players: req.userId }}
  await Tournament.update(query,operation)
  query = { _id: req.userId }
  operation = { $push: {tournamentsPlaying: req.params.id }}
  await User.update(query,operation)
  return res.status(200).json({result: 'User signed-up to tournament'})   
}
