"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = require("./app");
const PORT = 3000;
const server = http_1.default.createServer(app_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
app_1.app.set("io", io);
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
//# sourceMappingURL=server.js.map