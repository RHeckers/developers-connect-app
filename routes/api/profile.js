const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    GET api/profile/test
//@desc     Test route
//@access   public
router.get('/test', (req, res) => {
    res.json({msg: 'Profile Works'});
});

//@route    GET api/profile
//@desc     Get the current user profile
//@access   public
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile found for this user'
            return res.status(400).json(errors);

        }

        res.json(profile);
    })
    .catch(err => {
        res.status(400).json(err)
    });
});

module.exports = router;