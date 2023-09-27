const mongoose = require("mongoose");
const joi = require("joi");
const lodash = require("lodash");

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
    },
    subtitle: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
    },
    description: {
        type: String,
        minlength: 6,
        maxlength: 1024,
        required: true,
    },
    phone: {
        type: String,
        minlength: 9,
        maxlength: 10,
        required: true
    },
    email: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: true,
    },
    web: {
        type: String,
        minlength: 11,
        maxlength: 1024,
        required: true,
    },
    image: {
        url: {
            type: String,
            minlength: 11,
            maxlength: 1024,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        },
        alt: {
            type: String,
            minlength: 2,
            maxlength: 255,
            default: "user image",
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId,
        }
    },
    address: {
        state: {
            type: String,
            minlength: 0,
            maxlength: 255,
            default: "",
        },
        country: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true,
        },
        city: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true,
        },
        street: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true,
        },
        houseNumber: {
            type: String,
            minlength: 1,
            maxlength: 10,
            required: true,
        },
        zipCode: {
            type: String,
            minlength: 2,
            maxlength: 12,
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId,
        }
    },
    bizNumber: {
        type: String,
        minlength: 3,
        maxlength: 999_999_999,
        required: true,
        unique: true
    },
    likes: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Card = mongoose.model("Card", cardSchema, "cards");

function validateCard(card) {
    const schema = joi.object({
        title: joi.string().min(2).max(255).required(),
        subtitle: joi.string().min(2).max(255).required(),
        description: joi.string().min(6).max(1024).required(),
        phone: joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
        email: joi.string().min(6).max(255).required().email({ tlds: false }),
        web: joi.string().min(11).max(1024).required(),
        image: joi.object({
            url: joi.string().min(11).max(1024),
            alt: joi.string().min(2).max(255),
        }),
        address: joi.object({
            state: joi.string().min(0).max(255),
            country: joi.string().min(2).max(255).required(),
            city: joi.string().min(2).max(255).required(),
            street: joi.string().min(2).max(255).required(),
            houseNumber: joi.string().min(1).max(10).required(),
            zipCode: joi.string().min(2).max(12),
        }).required(),
    });

    return schema.validate(card);
}
function validateBizNumber(bizNumber) {
    const schema = joi.object({
        bizNumber: joi.number().min(100).max(999_999_999),
    });

    return schema.validate(bizNumber);
}
async function numberGeneration() {
    while (true) {
        const randomNumber = lodash.random(100, 999_999_999);
        const card = await Card.findOne({ bizNumber: randomNumber });
        if (!card) {
            return String(randomNumber);
        }
    }
}
module.exports = { Card, validateBizNumber, validateCard, numberGeneration };