const express = require("express");
require("dotenv").config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://doctors_admin:<password>@cluster0.or6bv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



app.get("/", (req, res) => {
   res.send("Doctors-Portal");
});

app.listen(port, () => {
   console.log(`Doctors portal app listening on port ${port}`);
});
