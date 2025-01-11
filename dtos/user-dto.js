module.exports = class userDto {
    email;
    name;
    id;
    isActivated;
    constructor(model) {
        this.email = model.email;
        this.name = model.name;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
};
