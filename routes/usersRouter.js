const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const Joi = require("joi");

const authMW = require("../middelware/auth");
const { validateUser, User } = require("../models/userSchema");

userRouter.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).send("user already registered");
        return;
    }
    user = new User(req.body);
    user.password = await bcrypt.hash(user.password, 12);
    await user.save();
    res.json(user);
});

userRouter.post("/login", async (req, res) => {

    const { error } = validatelogin(req.body);
    if (error) {
        res.status(400).json(error.details[0].message);
        return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).send("Invalid email or password");
        return;
    }
    const passCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passCheck) {
        res.status(400).send("Invalid email or password");
        return;
    }
    const token = user.generationAuthToken();
    res.send({ token });
});

userRouter.get("/", authMW("isAdmin"), async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(401).send(err.message);
        return;
    }
});

userRouter.get("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-__v -password -name._id -address._id -image._id");
        if (!user) {
            res.statusMessage =
                "User Operation Failed. A User with that ID was not found or you are not it's owner.";
            res
                .status(401)
                .send(
                    "User Operation Failed. A User with that ID was not found or you are not it's owner."
                );
            return;
        } else { res.send(user); }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

userRouter.put("/:id", authMW("userOwner"), async (req, res) => {

    let user = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user._id }
    });
    if (user) {
        res.status(401).send("There is a user with this email");
        return;
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        ).select("-__v -password -name._id -address._id -image._id");
        res.send(user);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

userRouter.patch("/:id", authMW("userOwner"), async (req, res) => {

    if (typeof req.body.isBusiness !== "boolean") {
        res.status(400).send(`the key "isBusiness" must be boolean value. `);
        return;
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBusiness: req.body.isBusiness }, { new: true })
            .select("-__v -password -name._id -address._id -image._id");
        if (!user) {
            res.statusMessage =
                "User Operation Failed. A User with that ID was not found or you are not it's owner.";
            res
                .status(401)
                .send(
                    "User Operation Failed. A User with that ID was not found or you are not it's owner."
                );
            return;
        } else { res.send(user); }
    } catch (err) {
        res.status(401).send(err.message);
    }
});

userRouter.delete("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send("The user is not exists");
            return;
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
});

function validatelogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email({ tlds: false }),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(user);
}

module.exports = userRouter;