const admin = require("firebase-admin");
require("dotenv").config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
  console.log("✅ Firebase Admin Initialized");
}

module.exports = admin;