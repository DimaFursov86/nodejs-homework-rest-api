const {BadRequest, Conflict} = require("http-errors");
const bcrypt = require("bcryptjs");
const { joiSignupSchema } = require("../../models/user");
const { User } = require("../../models");
const { nanoid } = require("nanoid");
const gravatar = require("gravatar");
const { SITE_NAME } = process.env;
const {sendEmail} = require("../../helpers");

const signup = async(req, res, next) => {
    try {
        const {error} = joiSignupSchema.validate(req.body);
        if(error){
            throw new BadRequest(error.message);
        }
        const {subscription, email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Conflict("Email in use");
        }
      
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const verificationToken = nanoid();
        const avatarURL = gravatar.url(email);
        const newUser = await User.create({ subscription, email, verificationToken, password: hashPassword, avatarURL });
        
         const data = {
                to: email,
                subject: "Подтверждение email",
                html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Подтвердить email</a>`
        }
        await sendEmail(data);

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        })
    } catch (error) {

        next(error);
    }
}
module.exports = signup;