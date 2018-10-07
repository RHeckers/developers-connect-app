const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation
const validateProfileInput = require('../../validation/profile');

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
//@access   private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
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


//@route    GET api/profile/
//@desc     Post request to create or edit user profile
//@access   private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Get profile fields
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.social = {};

    //Skills split into an array
    if(typeof req.body.skills !== 'undefinded') profileFields.skills = req.body.skills.split(',');

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.handle = req.body.website;
    if(req.body.location) profileFields.handle = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;

    //Social
    if(req.body.youtube) profileFields.social.youtube = req.body.social;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(profile){
            //Update the user profile
            Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields}, 
                {new: true}
                ).then(profile => res.json(profile));
            profile
        }else{
            //Create a user profile

            //Check if there is a handle
            Profile.findOne({handle: profileFields.handle})
            .then(profile => {
                if(profile){
                    errors.handle = 'that handle already exists';
                    res.status(400).json(errors);
                }
            });

            //Save new user profile
            new Profile(profileFields).save().then(profile => res.json(profile));
        }
    })

});

module.exports = router;