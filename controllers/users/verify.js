const { User } = require("../../models");
const { BadRequest, NotFound } = require("http-errors");
const { SITE_NAME } = process.env;
const {sendEmail} = require("../../helpers");

const verify = async(req, res, next)=> {
    try {
        const {email} = req.body;
        if(!email){
            throw new BadRequest("missing required field email");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new NotFound('User not found');
        }
        if(user.verify){
            throw new BadRequest("Verification has already been passed")
        }

        const {verificationToken} = user;
        const data = {
            to: email,
            subject: "Подтверждение email",
            html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Подтвердить email</a>`
        }

        await sendEmail(data);

        res.json({message: "Verification email sent"});
    } catch (error) {
        next(error);
    }
}
module.exports = verify;