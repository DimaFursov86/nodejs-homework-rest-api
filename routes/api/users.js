const express = require("express");
const {BadRequest, NotFound, Conflict, Unauthorized} = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticate, upload} = require("../../middlewares");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("Jimp");
const { nanoid } = require("nanoid");


const {User} = require("../../models");
const { joiSignupSchema, joiLoginSchema } = require("../../models/user");

const {sendEmail} = require("../../helpers");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const {SECRET_KEY, SITE_NAME} = process.env;

router.post("/signup", async(req, res, next) => {
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
});

router.patch("/avatars", authenticate, upload.single("avatar"), async(req, res)=> {
    const {path: tempUpload, filename} = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);
    await fs.rename(tempUpload, fileUpload);
     Jimp.read(fileUpload, function (err, test) {
        if (err) throw err;
        test.resize(250, 250)
            .quality(50)
            .rotate( 90 )
             .write(fileUpload); 
    });
    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(req.user._id, {avatarURL}, {new: true});
    res.json({avatarURL})
});


router.post("/login", async (req, res, next) => {
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
});
router.get("/logout", authenticate, async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: null});
    res.status(204).send();
});

router.get("/current", authenticate, async (req, res) => {
    const { subscription, email } = req.user;
    res.json({
        user: {
            subscription,
            email
        }
    })
});

router.post("/verify", async(req, res, next)=> {
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
})

router.get("/verify/:verificationToken", async(req, res, next)=> {
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
})

module.exports = router;