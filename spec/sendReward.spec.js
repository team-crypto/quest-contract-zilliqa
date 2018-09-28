const { code, runtest } = require('./common')


describe("sendReward test", () => {
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
		"_tag": "sendReward",
		"_amount": "0",
		"_sender" : "0x1234567890123456789012345678901234567890",
		"params": [
			{
				"vname": "_reward",
				"type": "Uint128",
				"value": "50"
			},
			{
				"vname": "_dest",
				"type": "ByStr20",
				"value": "0x1111111111111111111111111111111111111111"
			}
		]
	}

	const output = runtest("sendReward_test",state,message)

	describe("state test", () => {
		it('should be sendReward', () => {
			const balance = output.states.find( (state) => (state.vname === "_balance") )
			expect(balance.value).toBe("50")
		})
	})
	describe("message test", () => {
		it('should return reward_code', () => {
			expect(output.message.params[0].value).toBe(code.reward_code)
		})
	})
	describe("event test", () => {
		it('should return "RewardSent" event', () => {
			const output = runtest("sendReward_test",state,message)
			expect(output.events[0]._eventname).toBe("RewardSent")
		})
	})
})

describe("sendReward fail test", () => {
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
				"_tag": "sendReward",
				"_amount": "0",
				"_sender" : "0x1111111111111111111111111111111111111111",
				"params": [
					{
						"vname": "_reward",
						"type": "Uint128",
						"value": "50"
					},
					{
						"vname": "_dest",
						"type": "ByStr20",
						"value": "0x2222222222222222222222222222222222222222"
					}
				]
			}

			const output = runtest("sendReward_test",state,message)
			expect(output.message.params[0].value).toBe(code.not_owner_code)

		})
	})
	describe("fail when _reward is less than 0 or equal 0", () => {
		it('should return reward_invalid_code', () => {
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
				"_tag": "sendReward",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": [
					{
						"vname": "_reward",
						"type": "Uint128",
						"value": "0"
					},
					{
						"vname": "_dest",
						"type": "ByStr20",
						"value": "0x1111111111111111111111111111111111111111"
					}
				]
			}

			const output = runtest("sendReward_test",state,message)
			expect(output.message.params[0].value).toBe(code.reward_invalid_code)

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
					"value" : { "constructor": "True", "argtypes": [], "arguments": [] }
				}
			]
			const message = {
				"_tag": "sendReward",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": [
					{
						"vname": "_reward",
						"type": "Uint128",
						"value": "50"
					},
					{
						"vname": "_dest",
						"type": "ByStr20",
						"value": "0x1111111111111111111111111111111111111111"
					}
				]
			}

			const output = runtest("sendReward_test",state,message)
			expect(output.message.params[0].value).toBe(code.no_enough_balance_code)

		})
	})
	describe("fail when reward dest is owner", () => {
		it('should return self_reward_error_code', () => {
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
				"_tag": "sendReward",
				"_amount": "0",
				"_sender" : "0x1234567890123456789012345678901234567890",
				"params": [
					{
						"vname": "_reward",
						"type": "Uint128",
						"value": "50"
					},
					{
						"vname": "_dest",
						"type": "ByStr20",
						"value": "0x1234567890123456789012345678901234567890"
					}
				]
			}

			const output = runtest("sendReward_test",state,message)
			expect(output.message.params[0].value).toBe(code.self_reward_error_code)

		})
	})
})
