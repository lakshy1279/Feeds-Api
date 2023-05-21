const express=require('express');
const router=express.Router();
const passport=require('passport');
const postController=require('../controllers/post');
router.post('/create',postController.upload.array('images', 10),passport.authenticate("jwt", { session: false }),postController.create);
router.get('/posts',passport.authenticate("jwt", { session: false }),postController.getAllposts)
router.get('/posts/:id',passport.authenticate("jwt", { session: false }),postController.getPostById)
router.get('/author/:authorId',passport.authenticate("jwt", { session: false }),postController.getPostsByAuthor)
module.exports=router;