const fs = require('fs')
const childProcess = require('child_process')

const runtest = (testname,state,message) => {
	
	const state_json = JSON.stringify(state)
	fs.writeFileSync(`tests/${testname}/state.json`, state_json)

	const message_json = JSON.stringify(message)
	fs.writeFileSync(`tests/${testname}/message.json`, message_json)


	childProcess.execSync(`scilla-runner -init tests/init.json -istate tests/${testname}/state.json -imessage tests/${testname}/message.json -o tests/${testname}/output.json -iblockchain tests/blockchain.json -i Room.scilla -gaslimit 2000 -libdir stdlib`)
	return JSON.parse(fs.readFileSync(`tests/${testname}/output.json`,'utf8'))
}

const code = {
	set_deactive_code : "1",
	set_active_code   : "2",
	deposit_code      : "3",
	reward_code       : "4",
	refund_code       : "5",

	not_owner_code         : "256",
	already_deactive_code  : "257",
	already_active_code    : "258",
	amount_invalid_code    : "259",
	reward_invalid_code    : "260",
	no_enough_balance_code : "261",
	self_reward_error_code : "262",
	refund_is_only_when_deactive_code : "263"
}

module.exports = {
	code,
	runtest
}
