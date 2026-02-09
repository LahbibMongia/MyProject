const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name : {type : String, required : true },
        email : { 
            type : String, 
            require : [true, "email is required"], 
            unique : true },
            lowercase : true, 
             match: [
                /^\S+@\S+\.\S+$/,
                "Please fill a valid email address",
      ],

        password : { 
            type : String, required : true, 
             match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
                    ], 
                },
        adresse : {type : String, required : true},
        role : { type : String, enum: ["admin","user"], default: ["user"]}
    },
    {timestamp:true }
);
    userSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});
    const User = mongoose.model('User', userSchema);
    module.exports = User; 