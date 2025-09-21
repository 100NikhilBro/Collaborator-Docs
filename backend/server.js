const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const hpp = require('hpp');

dotenv.config();

const dbConnect = require('./config/db');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));



app.use(morgan("dev"));
app.use(helmet());
app.use(hpp());


app.use(cookieParser());
app.use(express.json());

dbConnect();

const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/docRoutes');
const activityRoutes = require('./routes/activityRoutes');
const collaboratorRoutes = require('./routes/collaboratorRoutes');

app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/collaborators', collaboratorRoutes);


const PORT = process.env.PORT || 5678;

app.get("/", (req, res) => {
    res.send(`<h1> Welcome to Backend </h1>`)
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
