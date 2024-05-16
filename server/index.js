import "dotenv/config.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectToMongo from "./db/mongodb.js"
import serverRoutes from "./routes/index.js"
import authRoute from "./auth/userAuth.js"
import authenticateUser from "./middleware/authenticateUser.js"
import { googleAuth } from "./auth/googleAuth.js"

//creat app by express
const app = express();

//Server PORT
const PORT = process.env.SERVER_PORT || 8000;

//server cors configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
  })
);

//Use cookie parser
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//Connecting to mongodb database
connectToMongo()
  .then(() => {

    //server listener
    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    })
  })
  .catch((err) => {
    console.log("MONGO db connection failed ! ", err);
  });


//Server endpoint
app.get('/', function (_, res) {
  res.json({ message: "Welcome to media cloud api server" })
});

app.post("/api/v1/login/google_login", googleAuth)

//user auth route
app.use('/api/v1/user', authRoute)

//Server all routes
app.use('/api/v1', authenticateUser, serverRoutes);


