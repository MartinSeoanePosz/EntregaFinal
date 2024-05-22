import { ProductRepository } from '../repositories/productRepository.js';
import { MessageRepository } from '../repositories/messagesRepository.js';
import { addLogger } from "../middleware/index.js";

const messageManager = new MessageRepository();

const handleChatSocketEvents = (socket) => {
  let visitas = 0;

  socket.on("new-user", (data) => {
    console.log("Received data from new user:", data);
    console.log("new client connected", data.user);

    socket.user = data.user;
    socket.id = data.id;
    visitas++;
    socket.broadcast.emit("new-user-connected", {
      message: `New user connected: ${visitas}`,
      user: data.user,
    });
  });

  socket.on("message", async (data) => {
    try {
      const user = data.user;
      if (!user) {
        console.error("Error: 'user' is required in the message data.");
        return;
      }
      const savedMessage = await messageManager.save({
        user,
        message: data.message,
        date: new Date().toISOString(),
      });
      socket.emit("messageLogs", [savedMessage]);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
};

export {  handleChatSocketEvents };
