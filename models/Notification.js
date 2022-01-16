const mongoose =require("mongoose")

const PostNotificationSchema = new monoose.Schema({
    read : Boolean,
    message : String , 
    postId : String , 
    userId : String
})

const LikeNotificationSchema = new monoose.Schema({
    read : Boolean,
    message : String , 
    likedId : String , 
    userId : String
    })

const CommentNotificationSchema = new monoose.Schema({
    read : Boolean,
    message : String , 
    commentedId : String , 
    userId : String, 
    })

const FollowNotificationSchema = new monoose.Schema({
    read : Boolean,
    message : String , 
    followId : String , 
    userId : String
})

const ShareNotificationSchema = new monoose.Schema({
    read : Boolean,
    message : String , 
    postId : String , 
    userId : String
    })

module.exports = mongoose.model("Notifications" , NotificationSchema)