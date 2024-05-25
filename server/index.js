import "dotenv/config.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectToMongo from "./db/mongodb.js"
import serverRoutes from "./routes/index.js"
import authenticateUser from "./middleware/authenticateUser.js"
import { googleAuth } from "./auth/googleAuth.js"

//creat app by express
const app = express();

//Server PORT
const PORT = process.env.SERVER_PORT || 8000;

//Split the ALLOW_ORIGINS environment variable into array
const allowedOrigins = process.env.ALLOW_ORIGINS.split(',').map(origin => origin.trim());

//server cors configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

//Use cookie parser
app.use(cookieParser());

//Use express json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"))

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

/********* Define All Routes ***********/

//google login & signup auth route
app.post("/api/v1/login/google_login", googleAuth)

// user related endpoints routes
app.use('/api/v1/user', authenticateUser, serverRoutes);


