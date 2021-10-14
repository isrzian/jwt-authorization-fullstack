const {validationResult} = require('express-validator')
const userService = require('../service/user')
const ApiError = require('../exeptions/api-error')

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка валидации!', errors.array()))
			}
			const {email, password} = req.body
			const userData = await userService.registration(email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 1200 * 1000, httpOnly: true})
			return res.json(userData)
		}
		catch (e) {
			next(e)
		}
	}

	async login(req, res, next) {
		try {

		}
		catch (e) {

		}
	}

	async logout(req, res, next) {
		try {

		}
		catch (e) {

		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL)
		}
		catch (e) {

		}
	}

	async refresh(req, res, next) {
		try {

		}
		catch (e) {

		}
	}

	async getUsers(req, res, next) {
		try {
			res.json([1, 2, 3, 4, 5])
		}
		catch (e) {

		}
	}
}

module.exports = new UserController()