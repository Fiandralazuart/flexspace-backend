import express from "express";
import cors from "cors";
import router from "./routes/api";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.get("/", (req, res) => {
	res.send("Testing API");
});

export default app;


