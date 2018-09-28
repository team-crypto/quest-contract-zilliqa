const { code, runtest } = require('./common')


describe("deactivate test", () => {
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
		"_tag": "deactivate",
		"_amount": "0",
		"_sender" : "0x1234567890123456789012345678901234567890",
		"params": []
	}

	const output = runtest("deactivate_test",state,message)

	describe("state test", () => {
		it('should be deactive', () => {
			const active = output.states.find( (state) => (state.vname === "active") )
			expect(active.value.constructor).toBe("False")
		})
	})
	describe("message test", () => {
		it('should return set_deactive_code', () => {
			expect(output.message.params[0].value).toBe(code.set_deactive_code)
		})
	})
	describe("event test", () => {
		it('should return "Deactivate" event', () => {
			const output = runtest("deactivate_test",state,message)
			expect(output.events[0]._eventname).toBe("Deactivate")
		})
	})
})

describe("deactivate fail test", () => {
	describe("fail when already deactivate", () => {
		it('should return already_deactive_code', () => {
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
				"_tag": "deactivate",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": []
			}

			const output = runtest("deactivate_test",state,message)
			expect(output.message.params[0].value).toBe(code.already_deactive_code)

		})
	})
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
					"value" : { "constructor": "True", "argtypes": [], "arguments": [] }
				}
			]
			const message = {
				"_tag": "deactivate",
				"_amount": "0",
				"_sender" : "0x1111111111111111111111111111111111111111",
				"params": []
			}
			const output = runtest("deactivate_test",state,message)
			expect(output.message.params[0].value).toBe(code.not_owner_code)
		})
	})
})
