const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const { BadRequest, Unauthorized } = require("http-errors");
const { joiLoginSchema } = require("../../models/user");
const bcrypt = require("bcryptjs");
const {SECRET_KEY} = process.env;

const login = async (req, res, next) => {
    try {
        const { error } = joiLoginSchema.validate(req.body);
        if (error) {
            throw new BadRequest(error.message);
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Unauthorized("Email or password is wrong");
        }
        if(!user.verify){
            throw new Unauthorized("Email not verified");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw new Unauthorized("Email or password is wrong");
        }

        const { _id, subscription } = user;
        const payload = {
            id: _id
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
        await User.findByIdAndUpdate(_id, { token });
        res.json({
            token,
            user: {
                email,
                subscription
            }
        })

    } catch (error) {
        next(error);
    }
}
module.exports = login;