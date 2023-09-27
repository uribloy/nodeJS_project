const joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255,
        },
        middle: {
            type: String,
            minlength: 2,
            maxlength: 255,
        },
        last: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255,
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId,
        }
    },
    phone: {
        type: String,
        minlength: 9,
        maxlength: 10,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBusiness: {
        type: Boolean,
        require: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.generationAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin, isBusiness: this.isBusiness }, config.get("auth.JWT_SECRET"));
};

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
    const schema = joi.object({
        name: joi.object({
            first: joi.string().min(2).max(255).required(),
            middle: joi.string().min(2).max(255),
            last: joi.string().min(2).max(255).required(),
        }).required(),
        phone: joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
        email: joi.string().min(6).max(255).required().email({ tlds: false }),
        password: joi.string().min(6).max(1024).required(),
        image: joi.object({
            url: joi.string().min(11).max(255),
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
        isBusiness: joi.boolean().required(),
    });

    return schema.validate(user);
}

module.exports = { User, validateUser };