const { code, runtest } = require('./common')


describe("activate test", () => {
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
		"_tag": "activate",
		"_amount": "0",
		"_sender" : "0x1234567890123456789012345678901234567890",
		"params": []
	}

	const output = runtest("activate_test",state,message)

	describe("state test", () => {
		it('should be active', () => {
			const active = output.states.find( (state) => (state.vname === "active") )
			expect(active.value.constructor).toBe("True")
		})
	})
	describe("message test", () => {
		it('should return set_active_code', () => {
			expect(output.message.params[0].value).toBe(code.set_active_code)
		})
	})
	describe("event test", () => {
		it('should return "activate" event', () => {
			const output = runtest("activate_test",state,message)
			expect(output.events[0]._eventname).toBe("Activate")
		})
	})
})

describe("activate fail test", () => {
	describe("fail when already activate", () => {
		it('should return already_active_code', () => {
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
				"_tag": "activate",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": []
			}

			const output = runtest("activate_test",state,message)
			expect(output.message.params[0].value).toBe(code.already_active_code)

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
					"value" : { "constructor": "False", "argtypes": [], "arguments": [] }
				}
			]
			const message = {
				"_tag": "activate",
				"_amount": "0",
				"_sender" : "0x1111111111111111111111111111111111111111",
				"params": []
			}
			const output = runtest("activate_test",state,message)
			expect(output.message.params[0].value).toBe(code.not_owner_code)
		})
	})
})
