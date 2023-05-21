const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    likeable:{
        type:mongoose.Schema.ObjectId,
        required:true,
        refPath:'OnModel'
    },
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},
{
    timestamps:true
});

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;