const jwt = require("jsonwebtoken");
const { token } = require("../server");

const verify = async (req, res, next) => {
  try {
    const authHeader = req.headers.cookie;
  
    if (!authHeader) {
      return res.sendStatus(401); 
    }
    const cookie = authHeader.split("=")[1];
  
    jwt.verify(cookie, token, async (err, decoded) => {
      if (err) {
        return res.status(401).send("This session has expired. Please log in.");
      }
  
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const verifyRole = (req, res, next) => {
  try {
    const user = req.user;
    const { role } = user; 

    if (role !== "admin") {
      return res.status(401).send("You are not authorized to view this page.");
    }
    
    next();

  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = { verify, verifyRole };