require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/^"|"$/g, '').replace(/\\n/g, '\n') : undefined
  }),
  storageBucket: 'snipslot-2629.appspot.com'
});

async function configureCors() {
  const bucket = admin.storage().bucket();
  await bucket.setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'HEAD'],
      origin: ['*'],
      responseHeader: ['*'],
    },
  ]);
  console.log('Successfully updated CORS configuration for Firebase Storage!');
}

configureCors().catch(console.error);
