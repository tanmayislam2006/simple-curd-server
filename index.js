const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());
// simpleUser
// s7AYJeye6CRKpka5
const uri =
  "mongodb+srv://simpleUser:s7AYJeye6CRKpka5@cluster0.kn8r7rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("userdb").collection("user");
    app.get("/", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    app.put("/user/:id", async (req, res) => {
      const updateInformation = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateInformation.name,
          email: updateInformation.email,
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const querry = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(querry);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`server is runnig http://localhost:${port}`);
});
