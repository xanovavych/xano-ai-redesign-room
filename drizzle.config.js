import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./config/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ai-room-redesign_owner:ZxQA1FpkJSI6@ep-wild-bird-a1ok6q9a.ap-southeast-1.aws.neon.tech/ai-room-redesign?sslmode=require",
  },
});
