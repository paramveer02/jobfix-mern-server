import dotenv from "dotenv";
import "./config/connectionDB.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

if (process.env.NOD_ENV === "development") {
  app.use(morgan("dev"));
}

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
