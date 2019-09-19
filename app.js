const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('The express erver is opened on port 3000')
});