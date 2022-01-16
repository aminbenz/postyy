const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server)
require('./socket/index')(io);

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");
const authenticateUser = require("./middlware/authentication");

// // middle ware
app.use(express.json({ limit: "25mb" }));
app.use(cors())

app.use("/api/auth", authRouter);
app.use("/api/users", authenticateUser, usersRouter);
app.use("/api/posts", authenticateUser, postRouter);
app.use("/api/conversations", authenticateUser, conversationRouter);
app.use("/api/messages", authenticateUser, messageRouter);


if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "build")));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname , 'build', 'index.html'));
  });
} 

const PORT = process.env.PORT || 8800

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () => {
      console.log(`Server is listening on Port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
start();
