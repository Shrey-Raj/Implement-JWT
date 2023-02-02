const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken') ; 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  posts:[{
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}],
    tokens:[{
      token:{
        type:String , 
      }
    }]
  
});

// userSchema.methods.generateAuthToken = async function(){
//   try {
//     const token = jwt.sign({id:this._id.toString()} , "mynameisshrey123mynameisshrey123mynameisshrey123") ; 
//     this.tokens = this.tokens.concat({token}) ; 
//     await this.save() ; 

//     console.log(token) ; 
//     return token ; 
//   } catch (error) {
//     // res.send("Error in Auth token " , error) ;
//     console.log("Error in auth tokrn , " , error) ;
//   }
// }




//Start with capital and shd be Singular
const AllUser = new mongoose.model("AllUser", userSchema);

module.exports =  AllUser;
