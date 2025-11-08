import dotenv from "dotenv";
dotenv.config();

console.log("🔍 ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("🔍 REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

// Check if the secrets contain any quote characters
const accessHasQuotes = /"/.test(process.env.ACCESS_TOKEN_SECRET);
const refreshHasQuotes = /"/.test(process.env.REFRESH_TOKEN_SECRET);

console.log("\n✅ Access Token Secret Contains Quotes:", accessHasQuotes);
console.log("✅ Refresh Token Secret Contains Quotes:", refreshHasQuotes);

if (accessHasQuotes || refreshHasQuotes) {
  console.log(
    "\n⚠️  Your secrets have extra quotes! Remove them from your .env file.",
  );
} else {
  console.log("\n✅ Secrets look clean — no quotes detected.");
}
