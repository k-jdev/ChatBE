const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");
const mailService = require("../service/mail-service");
const UserDto = require("../dtos/user-dto");
const tokenService = require("../service/token-service");

class UserService {
  async registration(email, password, name) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequests(
        `Користувач з такою поштовою скринькою ${email} вже існує`
      );
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await userModel.create({
      email,
      password: hashedPassword,
      activationLink: activationLink,
      name: name,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const chat = await chatModel.create({
      firstName: name,
      lastName: "",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user._id,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
      chatId: chat._id,
    };
  }
  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequests("Невірне посилання активації");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequests(
        `Користувач з поштовою скринькою ${email} не знайдений`
      );
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Невірний пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    user.isRegistered = true;
    await user.save();

    return {
      ...tokens,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedUser();
    }
    const token = tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedUser();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user); // Use 'UserDto' class
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
}

module.exports = new UserService();
