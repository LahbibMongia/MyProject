const mongoose = require ('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        date : {type : Date},
        status : {type : String, enum: ["en attente","confirmée","annulée", "Terminée"], default: ["user"]},
    },
    {timestamp:true }
);
  
    const Reservation = mongoose.model('Reservation', reservationSchema);
    module.exports = Reservation; 