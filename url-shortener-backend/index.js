import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.options("*", cors()); // Preflight requests

app.use(
  cors({
    origin: "https://weary-troll-v6pj9r99xggrcwjwr-5500.app.github.dev", // Client address
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // Allows the server to parse JSON requests

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
let short_URLarray = [];

const fetchShortURLs = async () => {
  const { data, error } = await supabase.from("URLs").select("short_URL");
  if (error) {
    console.error("Error fetching URLs:", error.message);
    return;
  }
  // Populate short_URLarray with existing short URLs
  short_URLarray = data.map((item) => item.short_URL);
};

// Generate a unique ID (or alias) for shortened URLs
const generateShortId = (shortCode) => {
  let result = shortCode || Math.random().toString(36).slice(2, 8);
  while (short_URLarray.includes(result)) {
    result = Math.random().toString(36).slice(2, 8); // Regenerate if duplicate
  }
  return result;
};

// Route to shorten URL
app.post("/shorten", async (req, res) => {
  const { original_URL, shortId: customCode } = req.body; // Extract the long URL from the request body
  await fetchShortURLs();
  let shortId = generateShortId(customCode);

  const { data, error } = await supabase
    .from("URLs")
    .insert([{ original_URL, short_URL: shortId, access_counter: 0 }]); // Initialize counter to 0

  if (error) {
    console.log("Insert error:", error);
    return res.status(500).json({
      error: error.message.includes("duplicate")
        ? "Custom short code already exists. Please try another."
        : "Failed to shorten URL",
    });
  }

  res.json({
    short_URL: `https://weary-troll-v6pj9r99xggrcwjwr-${PORT}.app.github.dev/${shortId}`,
  });
});

app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  // Fetch the original URL and current access_counter
  const { data, error } = await supabase
    .from("URLs")
    .select("original_URL, access_counter")
    .eq("short_URL", shortId)
    .single();

  if (error || !data) {
    console.log("Fetch error:", error);
    return res.status(404).json({ error: "URL not found" });
  }

  console.log("Current access_counter:", data.access_counter); // Log current counter

  // Attempt to update access_counter and last_accessed
  const { error: updateError, data: updateData } = await supabase
    .from("URLs")
    .update({
      access_counter: data.access_counter + 1,
      last_accessed: new Date().toISOString(),
    })
    .eq("short_URL", shortId);

  if (updateError) {
    console.log("Update error:", updateError);
    return res.status(500).json({ error: "Failed to update access count" });
  }

  console.log("Update successful:", updateData); // Log successful update response

  // Redirect to the original URL
  res.redirect(data.original_URL);
});
cron.schedule("0 0 * * *", async () => {
  //Every day at midnight.
  const { data, error } = await supabase
    .from("URLs")
    .delete()
    .lt(
      "last_accessed",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    );
  if (error) {
    console.error("Error deleting old records:", error);
  } else {
    console.log("Old records deleted:", data);
  }
});
app.listen(PORT, () => {
  console.log(
    `Server running on https://weary-troll-v6pj9r99xggrcwjwr-${PORT}.app.github.dev`
  );
});
