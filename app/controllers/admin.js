'use strict';

const mongoose = require("mongoose");
const {wrap: async } = require("co");
const {respond} = require("../utils");
const User = mongoose.model("User");
const {ObjectId} = require("mongodb");

exports.main = (req, res) =>
{
    User.find({}, (err, users) =>
    {
        res.render("layouts/default",
        {
	    partials:
	    {
		head: "includes/head.html",
		header: "includes/header.html",
		content: "layouts/admin.html",
		footer: "includes/footer.html",
		foot: "includes/foot.html"
	    },
	    nav_admin: true,
	    User: req.user,
	    users: users
        });
    });
};

exports.updateuser = (req, res) =>
{
    var user_data = req.body.user_data;

    User.find({_id: ObjectId(user_data.id)})
        .where("username").equals(user_data.username)
        .limit(1)
        .exec((err, user) =>
        {
            if(err || !user || user.length > 1)
            {
                console.error("Error updating user(%s)", user_data.id);
            }
            else
            {
                User.update({_id: ObjectId(user_data.id)},
                    {$set:
                        {
                            name:user_data.name,
                            email:user_data.email,
                            username:user_data.username,
                            Access: user_data.access
                        }
                    }
                ).exec((err, user) =>
                {
                    if(err || !user)
                    {
                        console.error(
                            "Error updating user(%s)",
                            user_data.id
                        );
                    }
                    else
                    {
                        res.json(user_data);
                    }
                })
            }
        })
        .catch(console.error);
};
