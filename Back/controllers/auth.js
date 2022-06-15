var { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    const email = req.body.email;
    User.countDocuments({ email: email }, async (err, count) => {
        if (count > 0) {
            return res.status(401).send(`L'email ${email} est déjà utilisée.`);
        } else {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    email: email,
                    password: hashedPassword
                });
                newUser.save((err, docs) => {
                    if (!err)
                        return res.status(200).send(docs);
                    else
                        return res.status(500).send(err)
                });
            } catch (err) {
                console.log(err);
            }
        }
    })
}

exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    try {
        if (user != null) {
            const math = await bcrypt.compare(req.body.password, user.password);
            const accessToken = jwt.sign(JSON.stringify(user), process.env.API_SECRET);
            if (math) {
                res.status(200).json({
                    userId: user._id,
                    token: accessToken
                });
            }
            else
                res.status(401).json({ message: "Adresse email ou mot de passe invalide." });
        } else {
            return res.status(401).json({ message: "Utilisateur introuvable." });
        }
    } catch (err) {
        console.log(err);
    }
}