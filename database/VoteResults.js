const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')

const VoteResults = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  date: String,
  name: String,
  votes: Array
})

module.exports = model('VoteResults', VoteResults)



