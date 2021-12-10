console.log("IO");

const socket = io('ws://localhost:4000');
socket.on("connection", () => {
    console.log('Connected');
});

socket.on("data", (data) => {
    console.log(data);
});