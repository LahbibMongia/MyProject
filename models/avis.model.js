const mongoose = require ('mongoose');

const avisSchema = new mongoose.Schema(
    {
        rating : {
            type : Number, 
            required : [true, "rating is required"],
            min : 1,
            max : 5
        },
        comment : {type : String},
        parent : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
        babysitter : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    },
    {timestamp:true }
); 

const Avis = mongoose.model('Avis', avisSchema);
module.exports = Avis; 
