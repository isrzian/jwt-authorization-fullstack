const jwt = require('jsonwebtoken')
const Token = require('../models/token')

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
		return {
			accessToken, refreshToken
		}
	}

	async saveToken(userId, refreshToken) {
		const tokenData = await Token.findOne({user: userId})
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}
		return await Token.create({user: userId, refreshToken})
	}
}

module.exports = new TokenService()