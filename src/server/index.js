
const dotenv = require('dotenv');
dotenv.config()
const API_W = process.env.API_KEY_weatherbit
const API_P = process.env.API_KEY_pixabay
console.log(`Your API key is ${API_W} and ${API_P}`);

const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const cors = require('cors')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


app.use(bodyParser.text())

const base_URL_G = "http://api.geonames.org/searchJSON?&maxRows=1&lang=en&username=Azamat&q="
const base_URL_W = "https://api.weatherbit.io/v2.0/forecast/daily?units=S&city="
const base_URL_P = "https://pixabay.com/api/?image_type=photo&pretty=true&per_page=3&key="
const port = 8081

// Designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Evaluate news app listening on port ${port}!`)
})

// Serves the main page to browser
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Tests the path between client and server, returns mock API response
app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

app.post('/call', callAPI)

async function callAPI(req, res) {
    // firstly fetching data from geonames
    const url_G = base_URL_G + req.body.theCity;
    let data_G = await fetch(url_G)
    if(data_G.status !== 200) {
        res.send({"message":"Please enter valid URL."})
        return
    }
    data_G = await data_G.json()
    let {name, countryName, lat, lng} = data_G.geonames[0];
    let howManyDays = req.body.theDaysLeft;

    // secondly fetching data from weatherbit
    const url_W = base_URL_W + req.body.theCity + `&key=${API_W}` + `&lat=${lat}&lon=${lng}`
    let data_W = await fetch(url_W)
    if(data_W.status !== 200) {
        res.send({"message":"Please enter valid URL."})
        return
    }
    
    // thirdly fetching data from pixabay
    const url_P = base_URL_P + API_P + `&q=${name}+city`
        let data = await fetch(url_P)
		data = await data.json()
        let imgURLs = [data.hits[1]?.previewURL, data.hits[2]?.previewURL]

    try {
        if (data_W.status == 200) {
            // fourthly adding all important results in one variable also image url from pixabay
            data_W = await data_W.json()
            const data = {
               destination: `${name}, ${countryName}`,
               coordinates: `Lat: ${lat}, Lon: ${lng}`,
               weather: data_W.data[0],
               imageURL: imgURLs,
               howManyDays
            }
            data.message = "Good data received from API"
            res.send(data)
        } else {
            res.send({"message":"Please enter valid URL."})
        }
    } catch (error) {
        console.error(error)
    }
}
