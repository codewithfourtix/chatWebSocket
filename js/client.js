const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("ting.mp3");

// Function to append messages to the chat container
const append = (message, position) => {
  const messageWrapper = document.createElement("div"); // Wrap messages in a div
  const messageElement = document.createElement("div");

  messageElement.innerText = message;

  // Apply classes for message styling
  messageElement.classList.add("p-3", "rounded-lg", "max-w-xs", "mb-2");

  if (position === "right") {
    messageElement.classList.add("bg-blue-500", "text-white");
  } else {
    messageElement.classList.add("bg-gray-200");
  }

  // Apply classes for wrapper alignment
  messageWrapper.classList.add(
    "flex",
    position === "right" ? "justify-end" : "justify-start"
  );

  messageWrapper.appendChild(messageElement); // Add message to wrapper
  messageContainer.appendChild(messageWrapper); // Add wrapper to container

  // Play notification sound for received messages
  if (position === "left") {
    audio.play();
  }

  // Scroll to the bottom of the container
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right"); // Fix: Your messages should align to the right
  socket.emit("send", message);
  messageInput.value = "";
});

// Prompt user for their name and emit event
const username = prompt("Enter your name to join");
socket.emit("new-user-joined", username);

// Event listener for a new user joining
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

// Event listener for receiving messages
socket.on("receive", (data) => {
  append(`${data.user}: ${data.message}`, "left"); // Fix: Received messages should align to the left
});

// Event listener for users leaving the chat
socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});
