const bcrypt = require('bcrypt')
const uuid = require('uuid')
const User = require('../models/user')
const mailService = require('../service/mail')
const tokenService = require('../service/token')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exeptions/api-error')

class UserService {
	async registration(email, password) {
		const candidate = await User.findOne({email})
		if (candidate) {
			throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует!`)
		}
		const hashPassword = await bcrypt.hash(password, 3)
		const activationLink = uuid.v4()
		const user = await User.create({email, password: hashPassword, activationLink})
		await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({...userDto})
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return {
			...tokens,
			user: userDto
		}
	}

	async activate(activationLink) {
		const user = await User.findOne({activationLink})
		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка активации!')
		}
		user.isActivated = true
		await user.save()
	}

}

module.exports = new UserService()