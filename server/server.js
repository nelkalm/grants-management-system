const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const db = admin.firestore();

app.post("/grants", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("grants").add(data);
    res.status(201).send(`Grant created with ID: ${docRef.id}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/grants/:id", async (req, res) => {
  //   console.log("Received GET request for /grants/:id");
  //   console.log("Requested document ID:", req.params.id);

  try {
    const doc = await db.collection("grants").doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send("Grant not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/grants/:id", async (req, res) => {
  try {
    const data = req.body;
    await db.collection("grants").doc(req.params.id).update(data);
    res.status(200).send(`Grant with ID: ${req.params.id} updated`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/grants/:id", async (req, res) => {
  try {
    await db.collection("grants").doc(req.params.id).delete();
    res.status(200).send(`Grant with ID: ${req.params.id} deleted`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
