const { env } = require('./env')

const Ain = require('@ainblockchain/ain-js').default
const ain = new Ain(env.AIN_EVENT_SERVER)

const { getResponse } = require('../routes/chatbot.internal')

// temp whitelist
const addressWhitelist = {
  0x664D279751DBB99AF6A533877Da322E415f60F5b: true
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
