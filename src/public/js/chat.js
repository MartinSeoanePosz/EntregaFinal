const socket = io();
if (window.location.pathname === '/chat' || window.location.pathname === '/chat/') {


socket.on("new-user-connected", (data) => {
  if (data.id !== socket.id)
    Swal.fire({
      text: `${data.user} Has connected`,
      toast: true,
      position: "top-end",
    });
});
let chatBox = document.getElementById("chatBox");

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const user = window.user;
    console.log(chatBox.value);
    socket.emit("message", {
      user,
      message: chatBox.value,
    });
    chatBox.value = "";
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let message = "";
  data.forEach((elem) => {
    message += `
    <div class="chat-message">
    <div class="message-bubble">
    <div class="message-sender">${elem.user}</div>
    <span style="font-size: 8px">${elem.date}</span>
    <p>${elem.message}</p>
          </div>
          </div>
          `;
        });
        
        log.innerHTML += message;
      });
      
      function firstLoad() {
        fetch("/messages")
        .then((res) => res.json())
        .then((data) => {
          let log = document.getElementById("messageLogs");
          let message = "";
          
      data.forEach((elem) => {
        message += `
        
        <div class="chat-message">
        <div class="message-bubble">
        
        <div class="message-sender" >${elem.user}</div>
        <span>${elem.date}</span>
        <p>${elem.message}</p>
        </div>
        
        </div>
        `;
      });
      
      log.innerHTML = message;
    });
  }
}