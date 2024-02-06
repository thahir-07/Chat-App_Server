const asyncHandler=require('express-async-handler')
const Message=require('../Modals/messageModel')
const User=require('../Modals/userModel')
const Chat =require('../Modals/chatModel')
const allMesages=asyncHandler(async(req,res)=>{
    try{
            const messages=await Message.find({chat:req.params.chatId})
            .populate('sender','name email')
            .populate('reciever')
            .populate('chat')
            res.json(messages)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
});

const sendMessages=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body
    if(!content || !chatId){
       return res.status(400)
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    }
    try{
        let message = await Message.create(newMessage);
        message=await  message.populate('sender','name')
        message=await  message.populate('chat')
        message=await  message.populate('reciever')
        message=await  User.populate(message,{
            path:'chat.users',
            select:'name email'
        })
        await Chat.findByIdAndupdate(req.body.chatId,{latestMessage:message})
        res.json(message)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
    

})

module.exports={
    allMesages,
    sendMessages
}