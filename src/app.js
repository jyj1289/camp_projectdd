const express = require('express');
const app = express();
const db = require("./models")
const port = 3000;
const indexRouter = require("./routes/indexRouter")
const cookieParser = require("cookie-parser");



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRouter);

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공 ");
  })
  .catch(console.error);
app.listen(port, () => {
  console.log(`listening  at http://localhost:${port}`);
});