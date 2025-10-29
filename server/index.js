import express from 'express'
import cors from 'cors'
import router from './routes.js'

const origin = process.env.ORIGIN || "http://localhost:5173";
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router)

app.listen(port, () => {
	console.log("Server started listening")
})