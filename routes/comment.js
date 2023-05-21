const express=require('express');
const router=express.Router();
const passport=require('passport');
const CommentController=require('../controllers/comment');
router.post('/create',passport.authenticate("jwt", { session: false }),CommentController.create);
module.exports=router;