require("dotenv").config();

const fs = require("fs");
const csv = require("csv-parser");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const db = admin.firestore();

function parseCsvAndUpdateFirestore(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results.forEach((document) => {
        updateDocument(document.id, document);
      });
    });
}

async function updateDocument(docId, fields) {
  if (!docId || typeof docId !== "string" || docId.trim() === "") {
    console.error("Invalid document ID:", docId);
    return; // Skip this update due to invalid ID
  }

  const docRef = db.collection("grants").doc(docId);
  try {
    await docRef.set(fields, { merge: true });
    console.log(`Document ${docId} updated successfully.`);
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

parseCsvAndUpdateFirestore("../elc_grants_list.csv");
