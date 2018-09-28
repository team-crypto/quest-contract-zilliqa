const { Zilliqa } = require('zilliqa-js')
const BN = require('bn.js')
const zilliqa = new Zilliqa({
	nodeUrl: 'http://localhost:4200'
})

const sendTx = (privateKey,node,tx) => {
		console.log(tx)
		const txJson = zilliqa.util.createTransactionJson(privateKey,tx)
		const msg = ''
		node.createTransaction(txJson, (err,data) => {
			console.log(err)
			console.log(data)
		})
}

const createTx = (node,nonce,amount,to) => {
	const transactionDetails = {
		version: 0,
		nonce: nonce,
		to: to,
		amount: new BN(amount),
		gasPrice: 1,
		gasLimit: 5000,
	}
	return transactionDetails
}

const createContract = (node,privateKey,nonce,code,contractState) => {
	const tx = createTx(node,nonce,0,'0000000000000000000000000000000000000000')
	const pubkey = zilliqa.util.getPubKeyFromPrivateKey(privateKey)
	tx.pubKey = pubkey
	tx.code = code
	tx.data = JSON.stringify(contractState).replace(/\\' /g, '"')
	return sendTx(privateKey,node,tx)
}

const createMessage = (node,privateKey,nonce,amount,to,message) => {
	const tx = createTx(node,nonce,amount,to)
	const pubkey = zilliqa.util.getPubKeyFromPrivateKey(privateKey)
	tx.pubKey = pubkey
	tx.data = message
	return sendTx(privateKey,node,tx)
}

module.exports = {
	createContract,
	createMessage
}
