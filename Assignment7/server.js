const express = require("express");
const utils = require("./utils");
const jwt = require("jsonwebtoken");
const config = require("./config");

const userRouter = require("./route/user");
const propertyRouter = require("./route/property");
const categoryRouter = require("./route/category");
const bookingRouter = require("./route/booking");

const app = express();

app.use((req, res, nxt) => {
  if (req.url === "/user/login" || req.url === "/user/register") {
    //skip verifying token
    nxt();
  } else {
    //get the token
    const token = req.headers["token"];
    console.log("tkoken", typeof token);
    if (!token || token.length == 0) {
      res.send(utils.createErrorResult("Missing token"));
    } else {
      try {
        //verify the token
        const payload = jwt.verify(token, config.secret);
        console.log("insidemiddleware");
        console.log("payload", payload["id"]);
        // add the userId to the request

        req.userId = payload["id"];
        console.log("Inserver req.userId", req.userId);

        // Todo: expiry logic

        // call the real route
        nxt();
      } catch (err) {
        res.send(utils.createErrorResult("Invalid token"));
      }
    }
  }
});

app.use(express.json());
app.use("/user", userRouter);
app.use("/property", propertyRouter);
app.use("/category", categoryRouter);
app.use("/booking", bookingRouter);

app.listen(9999, () => {
  console.log("server started at port 9999");
});
