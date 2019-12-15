const express = require('express');
const DataBase = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listen ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const db = new DataBase('database.db');
db.loadDatabase();


app.get('/api', (req, res) => {
    db.find({}, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
            return;
        }
        res.json(data);
    })
});

app.post('/api', (req, res) => {
    console.log('got req');
    // console.log(req.body);
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    db.insert(data);
    res.json(data);
});

// proxy server for darksky
app.get('/weather/:latlon', async (req, res) => {
    console.log(req.params);
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];

    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const air_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const air_response = await fetch(air_url);
    const air_data = await air_response.json();

    const data = {
        weather: weather_data,
        air_quality: air_data,
    };
    res.json(data);

});