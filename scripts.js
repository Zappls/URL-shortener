import { postFunction } from "./url-shortener-backend";



const shortenUrl = async (longUrl) => {
    try {
        const response = postFunction(longUrl);

        const data = await response.json();
        if (response.ok) {
            const newShortUrl = `https://localhost:3000/${data.shortUrl}`
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