var { Sauce } = require('../models/sauces');
const mongoose = require('mongoose');
const fs = require('fs');

exports.getSauces = async (req, res) => {
    const sauces = await Sauce.find();
    if (sauces != null) {
        return res.status(200).send(sauces);
    } else {
        return res.status(400).send({ error: { message: "Une erreur est survenu" } });
    }
}

exports.getSaucesById = async (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.params);
        const sauce = await Sauce.findById(id);
        if (sauce == null) {
            return res.status(404).send({ success: false });
        }
        return res.status(200).send(sauce);

    } catch (err) {
        res.status(500).json({ success: false, err })
    }
}

exports.add = async (req, res) => {
    try {
        const bodySauce = JSON.parse(req.body.sauce);
        const sauce = new Sauce({
            userId: bodySauce['userId'],
            name: bodySauce['name'],
            manufacturer: bodySauce['manufacturer'],
            description: bodySauce['description'],
            mainPepper: bodySauce['mainPepper'],
            imageUrl: "http://localhost:3000/uploads/" + req.file.filename,
            heat: bodySauce['heat'],
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
        await sauce.save((err) => {
            console.log(err)
        });
        res.status(200).send({ message: "Success" });
    } catch (err) {
        res.status(500).send({ message: "Error", err: err });
    }
}

exports.update = async (req, res) => {
    try {
        const idSauce = mongoose.Types.ObjectId(req.params.id);
        const userIdLogged = req.user._id;
        const sauceData = await Sauce.findById(idSauce).select('userId imageUrl');

        if (sauceData.userId === userIdLogged) {
            const sauce = {
                name: req.body.name,
                manufacturer: req.body.manufacturer,
                description: req.body.description,
                mainPepper: req.body.mainPepper,
                heat: req.body.heat
            };
            if (req.file != undefined) {
                sauce.imageUrl = "http://localhost:3000/uploads/" + req.file.filename;
                let currentImgName = sauceData.imageUrl.replace('http://localhost:3000/uploads/', '');
                try {
                    fs.unlinkSync('./uploads/' + currentImgName);
                } catch (err) {
                    console.log(err);
                }
            }
            Sauce.findByIdAndUpdate(idSauce, sauce, null, (err, result) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send(result);
            });
        } else {
            return res.status(403).send();
        }

    } catch (err) {
        console.log(err);
    }
}

exports.delete = async (req, res) => {
    const idSauce = mongoose.Types.ObjectId(req.params.id)
    const userIdLogged = req.user._id;
    try {
        let sauceData = await Sauce.findById(idSauce).select("userId imageUrl");
        if (sauceData.userId === userIdLogged) {
            if (sauceData != undefined) {
                let currentImgName = sauceData.imageUrl.replace('http://localhost:3000/uploads/', '');
                try {
                    fs.unlinkSync('./uploads/' + currentImgName);
                } catch (err) {
                    console.log(err);
                }
            }
            Sauce.findByIdAndDelete(idSauce, null, (err, result) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send(result);
            });
        } else {
            res.status(403).send();
        }
    } catch (err) {
        console.log(err);
    }
}

exports.like = async (req, res) => {
    const userId = req.body.userId;
    const likeValue = req.body.like;
    const sauce = await Sauce.findById(req.params.id);
    const updatedFields = {}
    switch (likeValue) {
        case 1:
            updatedFields.likes = sauce.likes += 1;
            updatedFields.usersLiked = sauce.usersLiked;
            updatedFields.usersLiked.push(userId);
            break;
        case 0:
            updatedFields.usersLiked = sauce.usersLiked;
            if (updatedFields.usersLiked.includes(userId)) {
                updatedFields.likes = sauce.likes -= 1;
                updatedFields.usersLiked.splice(updatedFields.usersLiked.indexOf(userId));
            } else {
                updatedFields.usersDisliked = sauce.usersDisliked;
                updatedFields.dislikes = sauce.dislikes -= 1;
                updatedFields.usersDisliked.splice(updatedFields.usersDisliked.indexOf(userId));
            }
            break;
        case -1:
            updatedFields.dislikes = sauce.dislikes += 1;
            updatedFields.usersDisliked = sauce.usersDisliked;
            updatedFields.usersDisliked.push(userId);
            break;
        default:
            break;
    }
    Sauce.findByIdAndUpdate(req.params.id, updatedFields, null, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    })
}