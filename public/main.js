new p5();
// setup();

function setup() {

    noCanvas();
    const video = createCapture(VIDEO);
    video.size(320, 140);

    // GEO locate
    let lat, lon;
    if ('geolocation' in navigator) {
        console.log('geolocation is avaible');
        navigator.geolocation.getCurrentPosition(async position => {
            lat = position.coords.latitude;
            document.getElementById('latitude').textContent = lat.toFixed(2);
            lon = position.coords.longitude;
            document.getElementById('longitude').textContent = lon.toFixed(2);

            const api_url = `weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const data = await response.json();
            console.log('data : ', data);

            const air = data.air_quality.results[0].measurements[0];
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = ` ${air.value} `;
            document.getElementById('aq_units').textContent = ` ${air.unit} `;
            document.getElementById('aq_date').textContent = air.lastUpdated.split('T')[0];

            const city = data.weather.timezone.split('/');
            document.getElementById('timezone').textContent = city[1];
            document.getElementById('summary').textContent = data.weather.currently.summary;
            const tempF = data.weather.currently.temperature;
            const temperatureC = (tempF - 32) * (5 / 9);
            document.getElementById('temperature').textContent = temperatureC.toFixed(2);
        });
    } else {
        console.log('geo not avaible');
    }

    // Handle button press
    const button = document.getElementById('btn_submit');
    button.addEventListener('click', async e => {
        const mood = document.getElementById('mood').value;
        video.loadPixels();
        const image64 = video.canvas.toDataURL();
        if (!mood) {
            return;
        } else {
            const data = { lat, lon, mood, image64 };
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            };
            const response = await fetch('/api', options);
            const json = await response.json();
            console.log(json);
        }
    })
}


