const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongodb

const uri =
   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.or6bv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

async function run() {
    try{
        await client.connect();
        const serviceCollection = client.db('doctors_portal').collection('services');

        app.get('/services', async(req, res) =>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
    }
    finally{}
}

run().catch(console.dir);
/**--------------*/ 
app.get("/", (req, res) => {
   res.send("Doctors-Portal");
});

app.listen(port, () => {
   console.log(`Doctors portal app listening on port ${port}`);
});
