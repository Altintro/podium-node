'use_strict'

const config = require('../config')
const slug = require('slug')
const Sport = require('../models/Sport')
const fs = require('fs')
const path = require('path')

const baseSportsImagesURL = config.host + '/images/sports/'

function mapBasicSport(sport) {
  return {
    _id: sport.id,
    name: sport.name,
    description: sport.description,
    rules: sport.rules,
    popularity: sport.popularity,
    image: baseSportsImagesURL + sport.slug + '/' + (sport.image || 'default.png')
  }
}

exports.mapBasicSport = mapBasicSport

exports.getSports = async (req, res, next) => {
  var sports = await Sport.find()
  sports = sports.map(mapBasicSport)
  return res.status(200).json({ result: sports })
}

exports.postSport = async (req,res,next) => {
  const sport = await Sport.create({
    name: req.body.name,
    description: req.body.description,
    rules: req.body.rules,
    slug: slug(req.body.name).toLowerCase()
  })
  return res.status(200).json({ success: true })
}

exports.uploadSportImage = async (req, res, next) => {
  const sport = await Sport.findById(req.params.id)
  let uploadsPath = path.resolve('../public/images/uploads')
  let imagePath = path.resolve('../public/images/sports/', sport.slug)

  if(!fs.existsSync(imagePath)) fs.mkdirSync(imagePath)

  fs.rename(uploadsPath + '/' + req.file.filename,
   imagePath + '/' + req.file.originalname,
    (err) => {
    if (err) return next(err)
  })

  sport.image = req.file.originalname
  await sport.save()
  return res.json({ success: true })
}

