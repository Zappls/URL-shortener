import { postFunction } from "./url-shortener-backend";

const shortenUrl = async (longUrl) => {
    try {
        const response = await fetch('https://localhost:3000/shorten', { // Correct the URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ original_URL: longUrl }) // Send the long URL in the body
        });

        const data = await response.json();
        if (response.ok) {
            const newShortUrl = data.short_URL; // The response should already provide the full shortened URL
            document.getElementById("shortUrlDisplay").innerHTML = `Shortened URL: <a href="${newShortUrl}" target="_blank">${newShortUrl}</a>`;
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

document.getElementById("urlForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const longUrl = document.getElementById("longUrl").value;

    shortenUrl(longUrl);
});
