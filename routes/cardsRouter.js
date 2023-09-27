const cardRouter = require("express").Router();
const lodash = require("lodash");

const authMW = require("../middelware/auth");
const { validateCard, validateBizNumber, Card, numberGeneration } = require("../models/cardSchema");

cardRouter.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        res.send(cards);
    } catch (err) {
        res.status(401).send(err.message);
        return;
    }
});

cardRouter.get("/my-cards", authMW(), async (req, res) => {
    try {
        const myCards = await Card.find({ user_id: req.user._id });
        res.send(myCards);
    } catch (err) {
        res.status(401).send(err.message);
        return;
    }
});

cardRouter.get("/:id", async (req, res) => {
    try {
        const card = await Card.findOne({ _id: req.params.id }).select("-__v -address._id -image._id");
        res.send(card);
    } catch (err) {
        res.status(401).send(err.message);
        return;
    }
});

cardRouter.post("/", authMW("isBusiness"), async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) {
        res.status(400).json(error.details[0].message);
        return;
    }
    const card = new Card({
        ...req.body,
        bizNumber: await numberGeneration(),
        user_id: req.user._id,
    });
    await card.save();
    res.send(lodash.pick(card,
        ["title", "subtitle", "description",
            "phone", "email", "web",
            "address", "bizNumber", "image"]));
});

cardRouter.put("/:id", authMW("cardOwner"), async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const card = await Card.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        ).select("-__v -address._id -image._id");
        res.send(card);
    } catch (err) {
        res.status(401).send(err.message);
        return;
    }
});

cardRouter.patch("/:id", authMW(), async (req, res) => {
    const card = await Card.findById(req.params.id);
    if (!card) {
        res.statusMessage =
            "Card Operation Failed. Card not found or the token is invalid.";
        res
            .status(401)
            .send(
                "Card Operation Failed. Card not found or the token is invalid."
            );
        return;
    }
    try {
        const foundCard = await Card.findOne({
            _id: req.params.id,
            "likes.user_id": req.user._id,
        });
        if (foundCard) {
            const card = await Card.findByIdAndUpdate(
                req.params.id,
                { "$pull": { likes: { user_id: req.user._id } } },
                { new: true });
            res.json(card);
        } else {
            const card = await Card.findByIdAndUpdate(
                req.params.id,
                { "$push": { likes: { user_id: req.user._id } } },
                { new: true }
            ); res.json(card);
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
});

cardRouter.delete("/:id", authMW("isAdmin", "cardOwner"), async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id).select("-__v -address._id -image._id");
        if (!card) {
            res.status(404).send("The card is not exists");
            return;
        } else {
            res.send(card);
        }
    } catch (err) {
        res.status(401).send(err.message);
        return;
    }
});

cardRouter.patch("/changeBizNumber/:id", authMW("isAdmin"), async (req, res) => {
    const card = await Card.findById(req.params.id);
    if (!card) {
        res.statusMessage =
            "Card Operation Failed. Card not found or the token is invalid.";
        res
            .status(401)
            .send(
                "Card Operation Failed. Card not found or the token is invalid."
            );
        return;
    }
    if (req.body.bizNumber) {
        const { error } = validateBizNumber(req.body);
        if (error) {
            res.status(400).json(error.details[0].message);
            return;
        }
        try {
            const card = await Card.findOne({
                bizNumber: req.body.bizNumber,
                _id: { $ne: req.params.id },
            });
            if (card) {
                res.status(401).send("A Card with this number already exists");
            };
        } catch (err) {
            res.status(401).send(err.message);
        }
    };
    try {
        const card = await Card.findOneAndUpdate(
            { _id: req.params.id },
            { bizNumber: req.body.bizNumber || (await numberGeneration()) },
            { new: true }
        );
        res.send(card);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

// check static-public
cardRouter.get("/test", (req, res) => res.end("hello"));

module.exports = cardRouter;