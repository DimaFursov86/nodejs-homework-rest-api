const { User } = require("../../models");
const {  NotFound } = require("http-errors");

const getVerifyToken = async(req, res, next)=> {
    try {
        const {verificationToken} = req.params;
        const user = await User.findOne({verificationToken});
        if(!user){
            throw new NotFound('User not found');
        }
        await User.findByIdAndUpdate(user._id, {verificationToken: null, verify: true});
        res.json({
            message: 'Verification successful'
        })
    } catch (error) {
        next(error);
    }
}
module.exports = getVerifyToken;