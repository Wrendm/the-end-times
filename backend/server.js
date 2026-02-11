const express = require('express')
const app = express()

const PORT = process.env.PORT || 3500

app.get(['/', '/index', '/index.html'], (req, res) => {
    res.send('API is running...');
});

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found`});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));