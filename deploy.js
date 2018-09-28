const fs = require('fs')
const BN = require('bn.js')
const { Zilliqa } = require('zilliqa-js')
const fetch = require('isomorphic-fetch')

const zilliqa = new Zilliqa({
	nodeUrl: 'http://localhost:4200'
})

const node = zilliqa.getNode()
const privateKey = '8790d60e8ef8ef057c7e1fef12eb610f8fdf472e34f38fe52dfe3db831c6108f'
const address = zilliqa.util.getAddressFromPrivateKey(privateKey)
const pubkey = zilliqa.util.getPubKeyFromPrivateKey(privateKey)

console.log(address)

const code = fs.readFileSync('./Room.scilla','utf-8')

const contractState = [
	{
		vname: 'owner',
		type : 'ByStr20',
		value : '0x' + address
	},
	{
        vname: '_creation_block',
        type: 'BNum',
        value: '1'
    }
]

const transactionDetails = {
	version: 0,
	nonce: 2,
	to: '0000000000000000000000000000000000000000',
	amount: new BN(0),
	gasPrice: 1,
	gasLimit: 5000,
	code: `${code}`,
	pubKey: pubkey,
	data: JSON.stringify(contractState).replace(/\\' /g, '"')
}
console.log(code)
console.log(transactionDetails.data)

const tx = zilliqa.util.createTransactionJson(privateKey,transactionDetails)

console.log(tx)

node.createTransaction(tx, (err,data) => {
	if (err) console.log('Error')
	console.log(data)
})
