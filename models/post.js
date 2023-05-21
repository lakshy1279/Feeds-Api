const mongoose=require('mongoose');
const Comment = require('./comment');

const PostSchema=new mongoose.Schema(
{
        content:{
          type:String,
          required:true
        },
        media:[{
          type:String
        }],
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        //include the array of id's of all the comments in this post schema itself
        comments:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
            },
        ],
        likes:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
            },
        ]
    },{
        timestamps:true
});
const Post=mongoose.model('Post',PostSchema);
module.exports=Post;