const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@pawmartcluster.0gvdng6.mongodb.net/?appName=PawMartCluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    console.log("MongoDB connected");

    const db = client.db("petService");

    const servicesCollection = db.collection("services");
    const listingsCollection = db.collection("listings");

   
    //   SERVICES ROUTES
    
    // POST service
    app.post('/services', async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();
      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });

    // GET all services
    app.get('/services', async (req, res) => {
      const email = req.query.email;

      let query = {};
      if (email) {
        query = { email: email }; 
      }

      const result = await servicesCollection.find(query).toArray();
      res.send(result);
    });


    // GET one service by ID
    app.get('/services/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await servicesCollection.findOne(query);
        res.send(result);
      } catch (err) {
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    // PUT / UPDATE service by ID
    app.put('/services/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        const result = await servicesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        res.send(result);
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });

    // DELETE service by ID
    app.delete('/services/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });


    //  LISTINGS ROUTES

    // POST listing
    app.post("/listings", async (req, res) => {
      try {
        const result = await listingsCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "DB insert failed" });
      }
    });

    // GET listings by email
    app.get("/listings", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ error: "Email is required" });
      }
      const result = await listingsCollection.find({ email }).toArray();
      res.send(result);
    });

    // DELETE listing by ID
    app.delete('/listings/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await listingsCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });

    // ORDERS COLLECTION
    const ordersCollection = db.collection("orders");

    // POST order
    app.post("/orders", async (req, res) => {
      try {
        const order = req.body;
        order.status = "pending";
        order.createdAt = new Date();

        const result = await ordersCollection.insertOne(order);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Order failed" });
      }
    });

    // GET orders by user email
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const result = await ordersCollection.find({ buyerEmail: email }).toArray();
      res.send(result);
    });

    // DELETE order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      const result = await db.collection("orders").insertOne(order);
    res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      const result = await db.collection("orders").insertOne(order);
      res.send(result);
    });


  } catch (err) {
    console.log(err);
  }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
  res.send('PawMart backend is running OK!');
});

app.listen(port, () => {
  console.log(`Paw Mart Server is running on port: ${port}`);
});