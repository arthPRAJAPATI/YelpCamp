mapboxgl.accessToken = mapToken;
const campGround = JSON.parse(campground)

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campGround.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});

new mapboxgl.Marker() 
    .setLngLat(campGround.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campGround.title}</h3><p>${campGround.location}</p>`
            )
    )
    .addTo(map)