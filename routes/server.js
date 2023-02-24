const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares/auth')

router.post('/stop', verifyToken, async function(req, res, next) {
  res.status(200).json({
    message: 'AINFT server is stopped'
  })

  process.exit(0)
})

module.exports = router
