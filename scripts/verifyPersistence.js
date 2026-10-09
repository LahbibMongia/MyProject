require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.Url_MongoDB);
  const { host, port, name } = mongoose.connection;
  console.log("Serveur :", host, port, "| Base :", name);

  const col = mongoose.connection.db.collection("users");
  console.log("Total users :", await col.countDocuments());

  const last = await col
    .find({}, { projection: { email: 1, role: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();
  console.table(last);

  console.log("Collections de la base :", (await mongoose.connection.db.listCollections().toArray()).map(c => c.name));
  await mongoose.disconnect();
})();