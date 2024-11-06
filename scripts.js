

const shortenUrl = async (longUrl) => {
  try {
    const response = await fetch(
      "https://weary-troll-v6pj9r99xggrcwjwr-3000.app.github.dev/shorten",
      {
        // shorten URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_URL: longUrl }), // Sends the long URL in the body
      }
    );

    const data = await response.json();
    if (response.ok) {
      document.getElementById(
        "shortUrlDisplay"
      ).innerHTML = `Shortened URL: <a href="${data.short_URL}" target="_blank">${data.short_URL}</a>`;
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

  shortenUrl(longUrl);
});
