import express from "express"
import cors from "cors"
import router from "./routes/api"

async function init() {
	const app = express()
	const PORT = 3000
	
	app.use(cors())
	app.use(express.json())

	app.use("/api", router)
	app.get("/", (req, res) => {
		res.send("Testing API")
	})

	app.listen(PORT, () => {
		console.log(`API is Ready! on port: ${PORT}`)
	})
}
init()