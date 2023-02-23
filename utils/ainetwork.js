const { env } = require('./env')

const Ain = require('@ainblockchain/ain-js').default
const ain = new Ain(env.AIN_API_SERVER, 0)
const ainetworkKey = require('../keys/ainetwork.json')

// load account
const privateKey = ainetworkKey.privateKey
const address = ain.wallet.addAndSetDefaultAccount(privateKey)

const createAccount = () => {
  const account = ain.wallet.create(1)
  const address = account[0]

  ain.wallet.setDefaultAccount(address)

  return ain.wallet.defaultAccount
}

const createApp = () => {
  ain.db
    .ref(`/manage_app/${env.APP_NAME}/create/${Date.now()}`)
    .setValue({
      value: {
        admin: {
          [address]: true,
        },
        // service: {
        //   staking: {
        //     lockup_duration: 604800000 // 7 days in ms
        //   }
        // }
      },
      nonce: -1,
    })
    .then((res) => {
      console.log(`res: ${JSON.stringify(res)}`)
    })
}

const setAppRule = () => {
  // ain.db.ref(env.APP_PATH).setRule({
  //   value: {
  //     '.rule': {
  //       'write': `auth.addr === '${address}'`,
  //     },
  //   },
  //   nonce: -1,
  // })
  //   .then((res) => {
  //     console.log(JSON.stringify(res, null, 2))
  //   })
  ain.db.ref(`${env.APP_PATH}/$address`).setRule({
    value: {
      '.rule': {
        'write': `auth.addr === $address || auth.addr === '${address}'`,
      },
    },
    nonce: -1,
  })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2))
    })
}

// createApp()
// setAppRule()

module.exports = {
  ain,
  address,
  createAccount,
  createApp,
  setAppRule
}
