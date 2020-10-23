const express = require('express');
const app = express(),
    bodyParser = require("body-parser");
port = 3080;

const users = [];

const baseURL = 'https://' +
    'bb5f98deba98e80a3a0256c53117c67a' +
    ':' +
    '4cc4d7ca89b5fb611f3fa305936c90f6' +
    '@www-eltabernaculo-cards.myshopify.com/admin/api/' +
    '2019-07';

app.use(bodyParser.json());

// Configurar cabeceras y cors

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/user', (req, res) => {
    const user = req.body.user;
    users.push(user);
    res.json("user added");
});

app.get('/', (req, res) => {
    res.send('AMN API Works !!!!!!');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

app.put('/api/update', (req, res) => {
    const url = baseURL + `/products/${card.shopifyID}.json`;
    return retry(async () => {
        // if anything throws, we retry
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: {
                    id: card.shopifyID,
                    variants: [
                        {
                            "id": card.variantID,
                            "price": price.value
                        }
                    ]
                }
            })
        });

        if (response.status === 429) {
            throw Error('Too many requests');
        } else if (!response.ok) {
            console.log(response);
            throw Error(response);
        }
        return response;
    }, {
        retries: 600,
        minTimeout: 2000
    });
});