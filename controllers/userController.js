'use_strict'
const User = require('../models/User')

exports.getUsers = (req, res, next) => {

    const limit = parseInt(req.query.limit)
    const fields = req.query.fields
    const sort = req.query.sort 
    // Make filter generation function
    const filter = {}
    const name = req.query.name
    const alias = req.query.alias
    if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
    if(alias){ filter.alias = { $regex: '^'+ alias, $options: 'i' }}

    User.find(filter)
        .select('-pass')
        .limit(limit)
        .sort(sort)
        .populate('gamesPlaying')
        .exec().then((users) => {
          return res.json({result: users})
        }).catch((err) => {
          return next(err) 
        })
}

exports.deleteUser =  (req,res,next) => {
    var query = {_id: req.params.id}
    User.deleteOne(query).exec().then((user) => {
      return res.json({deleted: true})
    }).catch((err) => {
      return next(err)
    })
}