const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.or6bv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

async function run() {
   try {
      const appointmentOptionCollection = client
         .db("doctorsPortal")
         .collection("appointmentOptions");
      const bookingsCollection = client
         .db("doctorsPortal")
         .collection("bookings");
      const usersCollection = client
         .db("doctorsPortal")
         .collection("users");

      // Use Aggregate to query multiple collection and then merge data
      app.get("/appointmentOptions", async (req, res) => {
         const date = req.query.date;
         const query = {};
         const options = await appointmentOptionCollection
            .find(query)
            .toArray();

         // get the booking of the provided date
         const bookingQuery = { appointmentDate: date };
         const alreadyBooked = await bookingsCollection
            .find(bookingQuery)
            .toArray();

         options.forEach((option) => {
            const optionBooked = alreadyBooked.filter(
               (book) => book.treatment === option.name
            );
            const bookedSlots = optionBooked.map((book) => book.slot);
            const remainingSlots = option.slots.filter(
               (slot) => !bookedSlots.includes(slot)
            );
            // (slot => bookedSlots.includes(slot)) it's mean bookedSlots এর মধ্যে যেই গুলা আছে সেইগুলা filter করে দিবে। আর (slot => !bookedSlots.includes(slot) এটা হচ্ছে যেই গুলা নাই সেই গুলা দিবে।

            option.slots = remainingSlots;
         });
         res.send(options);
      });

      app.get("/bookings", async (req, res) => {
         const email = req.query.email;
         const query = { email: email };
         const bookings = await bookingsCollection.find(query).toArray();
         res.send(bookings);
      });

      app.post("/bookings", async (req, res) => {
         const booking = req.body;
         const query = {
            appointmentDate: booking.appointmentDate,
            email: booking.email,
            treatment: booking.treatment,
         };
         const alreadyBooked = await bookingsCollection.find(query).toArray();
         if (alreadyBooked.length) {
            const message = `You already have a booking on ${booking.appointmentDate}`;
            return res.send({ acknowledged: false, message });
         }
         const result = await bookingsCollection.insertOne(booking);
         res.send(result);
      });
      /***
       * API Naming Convention
       *app.get('/bookings')
       * app.get('/bookings:id')
       * app.post('/bookings')
       * app.patch('/bookings:id')
       * app.delete('/bookings:id')
       */
      app.post('/users', async(req, res) =>{
          const user =req.body;
          const result = await usersCollection.insertOne(user);
          res.send(result);
      })
   } finally {
   }
}
run().catch(console.log);

app.get("/", async (req, res) => {
   res.send("doctors portal server is running");
});
app.listen(port, () => console.log(`Doctors portal running on ${port}`));
