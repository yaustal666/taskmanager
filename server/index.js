import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes.js';
import projectRouter from './routes/project.routes.js';
import taskRouter from './routes/task.routes.js';

const origin = process.env.ORIGIN || "http://localhost:5173";
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRouter)
app.use(projectRouter)
app.use(taskRouter)

app.listen(port, () => {
	console.log("Server started listening")
	console.log(port)
})