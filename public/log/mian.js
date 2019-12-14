getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    for (item of data) {
        const dateString = new Date(item.timestamp).toLocaleString();
        let template = `<div style="margin-bottom: 2em;"><p>Latitude: ${item.lat}</p><p>Longitude: ${item.lot}</p><p>Mood: ${item.mood}</p><p>created at ${dateString}</p><img src=${item.image64}></img></div>`;
        document.body.insertAdjacentHTML('beforeend', template);
    }
};