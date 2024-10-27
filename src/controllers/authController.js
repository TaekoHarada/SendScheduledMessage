import admin from "../config/firebase.js";

export const login = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    res.status(200).json({ uid, email: decodedToken.email });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ message: "Invalid credentials" });
  }
};
