const mongoose = require ('mongoose');

module.exports.connectToMongoDB = async () => {
   mongoose.connect(process.env.Url_MongoDB)
  .then((conn) => {
    console.log(`Connecté à la base : ${conn.connection.name}`);
  })
  .catch((err) => console.error(err));
};