const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')

const Users = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  name: String,
  role: String,
  team: String,
})

module.exports = model('Users', Users)



