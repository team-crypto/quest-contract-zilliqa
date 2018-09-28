const { code, runtest } = require('./common')


describe("refundToOwner test", () => {
	const state = [
		{
			"vname" : "_balance",
			"type" : "Uint128",
			"value" : "100"
		},
		{
			"vname": "active",
			"type" : "Bool",
			"value" : { "constructor": "False", "argtypes": [], "arguments": [] }
		}
	]
	const message = {
		"_tag": "refundToOwner",
		"_amount": "0",
		"_sender" : "0x1234567890123456789012345678901234567890",
		"params": []
	}

	const output = runtest("refundToOwner_test",state,message)

	describe("state test", () => {
		it('should be refundToOwner', () => {
			const balance = output.states.find( (state) => (state.vname === "_balance") )
			expect(balance.value).toBe("0")
		})
	})
	describe("message test", () => {
		it('should return refund_code', () => {
			expect(output.message.params[0].value).toBe(code.refund_code)
		})
	})
	describe("event test", () => {
		it('should return "RefundedToOwner" event', () => {
			const output = runtest("refundToOwner_test",state,message)
			expect(output.events[0]._eventname).toBe("RefundedToOwner")
		})
	})
})

describe("refundToOwner fail test", () => {
	describe("fail when sender is not owner", () => {
		it('should return not_owner_code', () => {
			const state = [
				{
					"vname" : "_balance",
					"type" : "Uint128",
					"value" : "100"
				},
				{
					"vname": "active",
					"type" : "Bool",
					"value" : { "constructor": "False", "argtypes": [], "arguments": [] }
				}
			]
			const message = {
				"_tag": "refundToOwner",
				"_amount": "0",
				"_sender" : "0x1111111111111111111111111111111111111111",
				"params": []
			}

			const output = runtest("refundToOwner_test",state,message)
			expect(output.message.params[0].value).toBe(code.not_owner_code)

		})
	})
	describe("fail when active", () => {
		it('should return refund_is_only_when_deactive_code', () => {
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
				"_tag": "refundToOwner",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": []
			}

			const output = runtest("refundToOwner_test",state,message)
			expect(output.message.params[0].value).toBe(code.refund_is_only_when_deactive_code)

		})
	})
	describe("fail when balance is not enough", () => {
		it('should return no_enough_balance_code', () => {
			const state = [
				{
					"vname" : "_balance",
					"type" : "Uint128",
					"value" : "0"
				},
				{
					"vname": "active",
					"type" : "Bool",
					"value" : { "constructor": "False", "argtypes": [], "arguments": [] }
				}
			]
			const message = {
				"_tag": "refundToOwner",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": []
			}

			const output = runtest("refundToOwner_test",state,message)
			expect(output.message.params[0].value).toBe(code.no_enough_balance_code)

		})
	})
})
