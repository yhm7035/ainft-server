const express = require('express')
const router = express.Router()

const { env } = require('../utils/env')
const { getResponse } = require('./chatbot.internal')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

router.post('/request', async function(req, res, next) {
  try {
    const { request, requestTime, address } = req.body

    if (!request || !requestTime || !address) {
      res.status(400).json({
        message: 'Request message, request time, and, address are required'
      })
    }

    const result = await getResponse(request, requestTime, address)

    if (result.success) {
      res.status(200).json({
        message: result.message
      })
    } else {
      res.status(500).json({
        message: result.message
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

module.exports = router
