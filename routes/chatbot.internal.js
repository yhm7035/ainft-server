const { ain } = require('../utils/ainetwork')
const { env } = require('../utils/env')
const { openAiChat } = require('../utils/openai')

const getValue = async (path) => {
  const response = await ain.db.ref(path).getValue()

  return response?.text
}

const setValue = async (path, value) => {
  const res = await ain.db.ref(path).setValue({
    value,
    nonce: -1,
  })

  console.log(res)
}

const getResponse = async (request, requestTime, address) => {
  try {
    const promptText = await getValue(`${env.APP_PATH}/${address}/prompt`)
    if (!promptText) {
      return {
        success: false,
        message: 'Error on loading prompt from AINetwork'
      }
    }

    const prompt = promptText + request + '\nAI:'

    const response = await openAiChat(prompt)
    // const response = 'Hi there! What can I do for you?'
    // await sleep(3000)

    await setValue(`${env.APP_PATH}/${address}/chat/${requestTime}/AI`, response)
    await setValue(`${env.APP_PATH}/${address}/prompt/text`, prompt + response + '\nHuman: ')

    // return GPT3 response
    return {
      success: true,
      message: response
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: 'Internal server error'
    }
  }
}

// const sleep = (ms) => {
//     return new Promise(resolve => setTimeout(resolve, ms))
// }

module.exports = {
  getValue,
  setValue,
  getResponse
}
