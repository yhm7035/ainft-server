const { env } = require('./env')

const Ain = require('@ainblockchain/ain-js').default
const ain = new Ain(env.AIN_API_SERVER, 1)
const ainetworkKey = require('../keys/ainetwork.json')

// load account
const privateKey = ainetworkKey.private_key
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
        service: {
          staking: {
            lockup_duration: 604800000
          }
        }
      },
      nonce: -1,
    })
    .then((res) => {
      console.log(`res: ${JSON.stringify(res)}`)
    })
    .catch((err) => {
      console.log(err)
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

// createAccount()
// createApp()
// setAppRule()

module.exports = {
  ain,
  address,
  createAccount,
  createApp,
  setAppRule
}
