const mongoose = require ('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        message : {type : String, required : [true, "message is required"]},
        type : {type : String, enum: ["reservation","message"], default: "reservation"},
        read : {type : Boolean, default: false},
        user : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
        
    },
    {timestamp:true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification; 
