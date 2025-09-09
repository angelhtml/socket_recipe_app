const express = require("express")
var cors = require('cors')
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const mongoose = require("mongoose");
const { Connect } = require("./utils/database");
const { MessageSchema } = require("./schema/message")
require('dotenv').config();

const PORT = process.env.PORT

app.use(cors())
//app.use(express.static('public'))

//connect to database
Connect()

const message = mongoose.model("message", MessageSchema);

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT}`,
        methods: ["GET","POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
})

io.on("connection", (socket) => {
    //console.log(`User connected : ${socket.id}`)

    //chat room
    socket.on("join_room", async (data) => {

        //find the room messages
        /*
        const get_messages = await message.find({
            $or: [
                    { sender: data.sender, getter: data.to },
                    { sender: data.to, getter: data.sender }
                ]
        })*/

        const get_messages = await message.find({room: data})
        //console.log("old: ", get_messages)
        

        //console.log("join_room: ",data)
        socket.join(data)

        socket.emit("old_message", get_messages)
    })

    //get message from front
    socket.on("send_message", async (data) => {
        //console.log("xxx: ",data)

        //save message
        
        await message.create({ 
            sender: data.sender,
            getter: data.to,
            content: data.message,
            room: data.room,
            date: Date.now()
        });
        
        //send message to show everyone in front
        socket.to(data.room).emit("receive_message", data)
    })

})



server.listen(PORT, function(){
    console.log(`socket is run on http://localhost:${PORT}`)
})
