const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const User = require('../../models/User');

//@route    GET api/usets/test
//@desc     Test route
//@access   public
router.get('/test', (req, res) => {
    res.json({msg: 'User Works'});
})

//@route    GET api/usets/register
//@desc     Register a user
//@access   public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if(user){
            return res.status(400).json({email: 'Email already exists'});
        }else{
            const avater = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm' });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avater,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        res.json(user)
                    })
                    .catch(err => {
                        console.log('You have an error: ', err);
                    })
                })
            });
        }
    })
});

//@route    GET api/users/register
//@desc     User login that will return JWT web token
//@access   public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find the user by email
    User.findOne({ email: email})
    .then(user => {
        if(!user){
            return res.status(404).json({email: 'User not found'});
        }

        //Check password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch){

                //Creating the payload for the webtoken
                const payload = {
                    id: user.id,
                    name: user.name,
                    avater: user.avatar
                }

                //Sign the token
                jwt.sign(payload, keys.secret, {expiresIn: 7200}, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                });

            }else{
                return res.status(400).json({ password: 'Password incorrect'})
            }
        })
    });

})

module.exports = router;