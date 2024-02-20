import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"

export const sendMessage = async (req,res) => {
    try {
        const {message} = req.body;
        const {id:reciverId} = req.params;
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all :[senderId, reciverId] }
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, reciverId]
            })
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        // Socket Io functionality

        // await conversation.save();
        // await newMessage.save()

        await Promise.all([conversation.save(),newMessage.save()]);

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in SendingMessage controller :",error.message)
        res.send(500).json({error:"Internal Sevrer Error"})
    }
}

export const getMessages = async (req,res)=>{

    try {

        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants:{$all:[senderId, userToChatId]}
        }).populate("messages"); //Not refernce

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages

        res.status(200).json(conversation.messages);
        
    } catch (error) {
        console.log("Error in SendingMessage controller :",error.message)
        res.send(500).json({error:"Internal Sevrer Error"})
    }


}