import { env } from "@facteur/env/server";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`Server started on port ${env.PORT}`);
});
