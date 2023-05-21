const express=require('express');
const passport=require('passport');
const router=express.Router();
const likeController=require('../controllers/like');

router.get('/toggle',passport.authenticate("jwt", { session: false }),likeController.toggleLike);

module.exports=router;