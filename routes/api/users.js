const express = require('express');
const router = express.Router();

//@route    GET api/usets/test
//@desc     Test route
//@access   public
router.get('/test', (req, res) => {
    res.json({msg: 'User Works'});
})

module.exports = router;