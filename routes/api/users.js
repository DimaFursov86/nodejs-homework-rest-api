const express = require("express");
const {BadRequest, Conflict, Unauthorized} = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticate} = require("../../middlewares");

const {User} = require("../../models");
const {joiSignupSchema, joiLoginSchema} = require("../../models/user");

const router = express.Router();

const {SECRET_KEY} = process.env;

// router.post("/signup")
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
        // const newUser = new User({name, email});
        /*
        newUser = {
            email, name
        }
        */
        // newUser.setPassword(password);
        // const result = newUser.save();
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({subscription, email, password: hashPassword});
        res.status(201).json({
            user: {
                subscription: newUser.name,
                email: newUser.email,
            }
        })
    } catch (error) {

        next(error);
    }
});

// router.post("/signin")
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
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw new Unauthorized("Email or password is wrong");
        }
        // if(!user){
        //     throw new Unauthorized("Email not found")
        // }
        // // const passwordCompare = user.comparePassword(password);
        // const passwordCompare = await bcrypt.compare(password, user.password);
        // if(!passwordCompare){
        //     throw new Unauthorized("Password wrong")
        // }
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

router.get("/current", authenticate, async(req, res)=> {
    const {subscription, email} = req.user;
    res.json({
        user: {
            subscription,
            email
        }
    })
})

module.exports = router;