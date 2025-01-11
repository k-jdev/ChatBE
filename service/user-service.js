const userModel = require("../models/user-model");
const bcrypt = require("bcrypt")
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");
const mailService = require("../service/mail-service");
const UserDto = require("../dtos/user-dto");
const tokenService = require("../service/token-service");

class UserService {
    async registration(email, password, name) {
        const candidate = await userModel.findOne({ email });
        if(candidate) {
            throw ApiError.BadRequests(`Користувач з такою поштовою скринькою ${email} вже існує`)
        }
        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await userModel.create({
            email,
            password: hashedPassword,
            activationLink: activationLink,
            name: name,
        })
        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/activate/${activationLink}`
        )

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }
}