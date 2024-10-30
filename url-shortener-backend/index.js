// index.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Allows the server to parse JSON requests

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Generate a unique ID (or alias) for shortened URLs
const generateShortId = () => Math.random().toString(36).substr(2, 6); // Generates a random 6-character string

// Route to shorten URL
app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Generate a short URL identifier
    const shortId = generateShortId();

    // Store the URL and shortId in Supabase
    const { data, error } = await supabase
        .from('URLs')  // Adjust to match your Supabase table name
        .insert([{ original_URL: longUrl, short_URL: shortId }]);

        if (error) {
            console.log(error);
        return res.status(500).json({ error: 'Failed to shorten URL' }) 
    }

    res.json({ short_URL: `http://localhost:${PORT}/${shortId}` });
});

// Route to handle redirection
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;

    // Fetch the original URL from Supabase using the shortId
    const { data, error } = await supabase
        .from('URLs')  // Adjust to match your Supabase table name
        .select('original_URL')
        .eq('short_URL', shortId)
        .single();

    if (error || !data) {
        return res.status(404).json({ error: 'URL not found' });
    }

    // Redirect to the original URL
    res.redirect(data.original_URL);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
