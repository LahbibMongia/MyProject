const mongoose = require ('mongoose');

const recommendationSchema = new mongoose.Schema(
    {
        score_matching : {type : Number, required : true},
        parent : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
        babysitter : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
        
    },
    {timestamp:true }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;  