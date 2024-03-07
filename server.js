const PORT = 8000;
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/chat', async (req, res) => {
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const chat = model.startChat({
        history: req.body.history
    });

    const msg = req.body.message;

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

