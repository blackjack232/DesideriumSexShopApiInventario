const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  rol:{
    type: String,
    enum: ['ADMINISTRADOR','CLIENTE'],
    default: 'CLIENTE',
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  deparment: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  registrationDate: {
    type: Date,
    required: true
  }, 
  password:{
    type: String,
    required: true
  },
  state:{
    type: Number
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
});
userSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('User', userSchema);