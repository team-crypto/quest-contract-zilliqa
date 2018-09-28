const { code, runtest } = require('./common')


describe("deposit test", () => {
	const state = [
		{
			"vname" : "_balance",
			"type" : "Uint128",
			"value" : "100"
		},
		{
			"vname": "active",
			"type" : "Bool",
			"value" : { "constructor": "True", "argtypes": [], "arguments": [] }
		}
	]
	const message = {
		"_tag": "deposit",
		"_amount": "100",
		"_sender" : "0x1234567890123456789012345678901234567890",
		"params": []
	}

	const output = runtest("deposit_test",state,message)

	describe("state test", () => {
		it('should be more balance', () => {
			const balance= output.states.find( (state) => (state.vname === "_balance") )
			expect(balance.value).toBe("200")
		})
	})
	describe("message test", () => {
		it('should return deposit_code', () => {
			expect(output.message.params[0].value).toBe(code.deposit_code)
		})
	})
	describe("event test", () => {
		it('should return "Deposited" event', () => {
			const output = runtest("deposit_test",state,message)
			expect(output.events[0]._eventname).toBe("Deposited")
		})
	})
})

describe("deposit fail test", () => {
	describe("fail when _amount is less than 0", () => {
		it('should return amount_invalid_code', () => {
			const state = [
				{
					"vname" : "_balance",
					"type" : "Uint128",
					"value" : "100"
				},
				{
					"vname": "active",
					"type" : "Bool",
					"value" : { "constructor": "True", "argtypes": [], "arguments": [] }
				}
			]
			const message = {
				"_tag": "deposit",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": []
			}

			const output = runtest("deposit_test",state,message)
			expect(output.message.params[0].value).toBe(code.amount_invalid_code)
		})
	})
})
