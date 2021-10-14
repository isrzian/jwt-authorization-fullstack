const bcrypt = require('bcrypt')
const uuid = require('uuid')
const User = require('../models/user')
const mailService = require('../service/mail')
const tokenService = require('../service/token')
const UserDto = require('../dtos/user-dto')

class UserService {
	async registration(email, password) {
		const candidate = await User.findOne({email})
		if (candidate) {
			throw new Error(`Пользователь с адресом ${email} уже существует!`)
		}
		const hashPassword = await bcrypt.hash(password, 3)
		const activationLink = uuid.v4()
		const user = await User.create({email, password: hashPassword, activationLink})
		await mailService.sendActivationMail(email, activationLink)
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({...userDto})
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return {
			...tokens,
			user: userDto
		}
	}
}

module.exports = new UserService()