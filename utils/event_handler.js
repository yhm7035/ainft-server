const { env } = require('./env')

const Ain = require('@ainblockchain/ain-js').default
const ain = new Ain(env.AIN_EVENT_SERVER)

const { getResponse } = require('../routes/chatbot.internal')

// temp whitelist by address
const addressWhitelist = {
  0xf2AE8CD9C2f8bc5C7409b6E9458AB00726E2ac57: true
}

const registerEvent = async () => {
  await ain.em.connect()
  console.log('connected to event handler node')

  ain.em.subscribe('VALUE_CHANGED', {
    path: `${env.APP_PATH}/$address/chat/$requestTime/Human`,
  }, async (valueChangedEvent) => {
    const request = valueChangedEvent.values.after
    const requestTime = valueChangedEvent.params.requestTime
    const address = valueChangedEvent.params.address

    const eventSource = valueChangedEvent.event_source

    if (eventSource === 'USER') {
      await getResponse(request, requestTime, address)
    }
  }, (err) => {
    console.log(err)
  })
}

module.exports = {
  registerEvent
}
