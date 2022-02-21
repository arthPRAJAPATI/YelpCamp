const mongoose = require('mongoose');
const cities = require('./cities');
const campGround = require('../models/campGround');
const { places, descriptors } = require('./seedHelpers');

//logic to connect to database
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//checking for success in database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connection Successful");
});

//returns a random place and descriptor
const sample = array => array[Math.floor(Math.random() * array.length)];

//seeds(populate) the database with random value
const seedDB = async () => {
    await campGround.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let random = Math.floor(Math.random() * 1000);
        const camp = new campGround({
            author: '61b1ccf8ea3e6f2efd39c667',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random].city}, ${cities[random].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/duehf9y9p/image/upload/v1641105224/sample.jpg',
                    filename: 'sample'
                },
                {
                    url: 'https://res.cloudinary.com/duehf9y9p/image/upload/v1641105224/sample.jpg',
                    filename: 'sample'

                }
            ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus, minima quia id aspernatur reprehenderit aperiam ea exercitationem consequatur adipisci necessitatibus, voluptates ducimus voluptate, nobis dolor asperiores assumenda delectus veniam dolorem!',
            price: `${Math.floor(Math.random() * 100)}`
        });
        await camp.save();
    }
};

//closes the connection to DB after completion of seeding
seedDB().then(() => {
    mongoose.connection.close();
});