import http from "http";
import { Server } from "socket.io";
import { app } from "./app";

const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

app.set("io", io);

io.on("connection", (socket) => {
	console.log(`Client ${socket.id} connected`);

	socket.emit("hello", {
		message: "Halo dari backend",
	});

	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} disconnected`);
	});
});

server.listen(PORT, () => {
	console.log(`API is Ready! on port: ${PORT}`);
});
