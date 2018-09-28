const fs = require('fs')
const { Zilliqa } = require('zilliqa-js')
const fetch = require('isomorphic-fetch')
const { createTx, createContract } = require('./deploy.lib')

const zilliqa = new Zilliqa({
	nodeUrl: 'http://localhost:4200'
})

const node = zilliqa.getNode()
const privateKey = 'cb9ae470750f4ed2e4f1d79ea540a600b236f15caa867752c1ee757b97f2df9d'
const address = zilliqa.util.getAddressFromPrivateKey(privateKey)
const pubkey = zilliqa.util.getPubKeyFromPrivateKey(privateKey)

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

const nonce = 1;

createContract(node,privateKey,nonce,code,contractState)
