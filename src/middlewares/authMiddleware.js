const { admin } = require("../config/firebase");

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
}

module.exports = authenticate;
