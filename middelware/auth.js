const jwt = require("jsonwebtoken");
const config = require("config");
const { Card } = require("../models/cardSchema");

function authMW(...roles) {
    //roles: "isAdmin","isBusiness","userOwner","cardOwner"
    return async (req, res, next) => {
        const token = req.header("x-auth-token");
        if (!token) {
            res.statusMessage = "Access Denied. No token provided";
            res.status(401).send("Access Denied. No token provided");
            return;
        }
        try {
            const decode = jwt.verify(token, config.get("auth.JWT_SECRET"));
            req.user = decode;
            if (!roles || roles.length == 0) {
                next();
            } else if (roles.includes("isAdmin") && req.user.isAdmin) {
                next();
            } else if (roles.includes("userOwner") && req.user._id == req.params.id) {
                next();
            } else if (roles.includes("cardOwner")) {
                try {
                    const card = await Card.findOne({
                        _id: req.params.id,
                        user_id: req.user._id,
                    });
                    if (!card) {
                        res.statusMessage =
                            "Card Operation Failed. A Card with that ID was not found or you are not it's owner.";
                        res
                            .status(401)
                            .send(
                                "Card Operation Failed. A Card with that ID was not found or you are not it's owner."
                            );
                        return;
                    } else {
                        next();
                    }
                } catch (err) {
                    res.statusMessage("Error finding any card.");
                    res.status(401).send("Error finding any card.");
                    return;
                }
            } else if (roles.includes("isBusiness") && req.user.isBusiness) {
                next();
            } else {
                res.statusMessage =
                    "Access Denied. User does not have the proper authorization.";
                res
                    .status(400)
                    .send("Access Denied. User does not have the proper authorization.");
                return;
            }
        } catch (err) {
            res.statusMessage = "Invalid Token";
            res.status(400).send("Invalid Token");
            return;
        }
    };
}

module.exports = authMW;