const { Configuration, OpenAIApi } = require('openai')
const { encode } = require('gpt-3-encoder')
const openaiKey = require('../keys/openai.json')

const configuration = new Configuration(openaiKey)

const openai = new OpenAIApi(configuration)

const openAiChat = async (prompt) => {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [' Human:', ' AI:'],
  })

  return completion.data.choices[0].text
}

const getNumberOfTokens = (prompt) => {
  // return type of encode is array
  const encoded = encode(prompt)
  return encoded.length
}

module.exports = {
  openai,
  openAiChat,
  getNumberOfTokens
}