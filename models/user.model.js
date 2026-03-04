const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name : {type : String, required : true },
        email : { 
            type : String, 
            required : [true, "email is required"], 
            unique : true ,
            lowercase : true, 
             match: [
                /^\S+@\S+\.\S+$/,
                "Please fill a valid email address",
      ],},

        password : { 
            type : String, required : true, 
             match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
                    ], 
                },
        adresse : {type : String},
        role : { type : String, enum: ["admin","babysitter","parent"], default: "parent"},
        image: {
            type: String,
            default: "default.jpg"
        },



        // Parent specific
        preferences: {
            type: String,
            required: function () {
            return this.role === 'parent';
            }
        },

        // Babysitter specific
        experience: {
            type: String,
            required: function () {
            return this.role === 'babysitter';
            }
        },
        availability: {
            type: String,
            required: function () {
            return this.role === 'babysitter';
            }
        },
        hourlyRate: {
            type: Number,
            required: function () {
            return this.role === 'babysitter';
            }
        },
        certif: {
            type: String,
            required: function () {
            return this.role === 'babysitter';
            }

        },
        score: {
            type: Number,
            default: 0
        },

        // Admin specific
        adminCode: {
            type: String,
            required: function () {
            return this.role === 'admin';
            }
        }
    },
    {timestamps:true }
);
   userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
    const User = mongoose.model('User', userSchema);
    module.exports = User; 