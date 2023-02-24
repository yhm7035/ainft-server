const jwt = require('jsonwebtoken')
const jwtKey = require('../keys/jwt.json')

const verifyToken = async (req, res, next) => {
  const authToken = req.header('authToken')

  if (!authToken) {
    return res.status(400).json({
      message: 'Invalid header.'
    })
  }

  const publicKey = jwtKey.public_key

  try {
    jwt.verify(authToken, publicKey)
  } catch (err) {
    return res.status(400).json({
      message: 'Token is incorrect.'
    })
  }
  next()
}

module.exports = {
  verifyToken
}
