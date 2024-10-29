document.getElementById("urlForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const longUrl = document.getElementById("longUrl").value;

    // Placeholder: Code to handle URL shortening will go here

    // Example display of a shortened URL
    const shortUrl = "https://short.ly/abc123"; // This would be generated dynamically
    document.getElementById("shortUrlDisplay").innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
});
