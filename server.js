const express = require('express')
const axios = require('axios')
const app = express();
const parseString = require('xml2js').parseString;


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to learn backend with express!')
});

app.get('/book/:isbn/:retry', function(req, res) {
    let isbn = { isbn: req.params.isbn, retry: req.params.retry }
    res.send(isbn)
});

app.get("/:isbn/:retry?", function(req, res) {
    // let isbn = req.params.isbn
    const goodReads = `https://www.goodreads.com/search/index.xml?q=${req.params.isbn}&key=6qVbqOjnzhHws97M5gYYA`
    const gapi = `https://www.googleapis.com/books/v1/volumes?q=${req.params.isbn}&maxResults=1&printType=books`
    if (req.params.retry) {
        //  GoodReads
        axios.get(goodReads).then(resp => {
            parseString(resp.data, function(err, result) {
                // console.dir(JSON.stringify(result));
                console.log(result.GoodreadsResponse.search[0].results[0].work[0].best_book[0], err)
                res.send(result.GoodreadsResponse.search[0].results[0].work[0].best_book[0])
            });

            // console.log('GR', resp.data)

        })

    } else {
        axios.get(gapi).then(resp => {
            console.log('GAPI', resp.data)
            res.send(resp.data.items[0].volumeInfo)
        })
    }
});

app.listen(8080, () => {
    console.log('Example app listening on port 8080!')
});