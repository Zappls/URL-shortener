const shortenUrl = async (longUrl, shortCode) => {
  try {
    const response = await fetch(
      "https://weary-troll-v6pj9r99xggrcwjwr-3000.app.github.dev/shorten",
      {
        // shorten URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_URL: longUrl, shortId: shortCode }), // Sends the long URL in the body
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log(
        "URL: ",
        data.short_URL,
        "shortCode.length",
        shortCode.length
      );
      let urliBurli = data.short_URL.slice(-shortCode.length);
      document.getElementById(
        "shortUrlDisplay"
      ).innerHTML = `Shortened URL: <a href="${data.short_URL}" target="_blank">URLiab.com/${urliBurli}</a>`;
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

document.getElementById("urlForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const longUrl = document.getElementById("longUrl").value;
  const shortCode = document.getElementById("shortCode").value;
  const rndCode = Math.random().toString(36).slice(2, 8);
  if (shortCode == "") {
    shortenUrl(longUrl, rndCode);
  } else {
    shortenUrl(longUrl, shortCode);
  }
});
