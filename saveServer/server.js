const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const host = '127.0.0.1';
const port = 4000;

const app = express();

// noinspection JSCheckFunctionSignatures
app.use(cors());

app.use(bodyParser.json({
    limit: '100mb',
}));

app.use(bodyParser.urlencoded({
    extended: true,
}));

app.get('/ping', function (request, response) {
    return responseJson(response, 200, 'pong');
});

app.get('/get', function (request, response) {
    let urlInfo = url.parse(request.url);
    let queryParams = querystring.parse(urlInfo.query);

    let key = queryParams.key;
    let path = getSavePath(key);

    if (!fs.existsSync(path)) {
        return responseJson(response, 200, {});
    }

    let fileContents = fs.readFileSync(path, 'utf8').toString();

    return responseJsonText(response, 200, fileContents);
});

app.post('/set', function (request, response) {
    let key = request.body.key;
    let value = request.body.value;

    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }

    fs.writeFileSync(getSavePath(key), value, 'utf8');

    return responseJson(response, 200, {
        status: 'OK',
    });
});

app.post('/remove', function (request, response) {
    let key = request.body.key;

    fs.unlinkSync(getSavePath(key));

    return responseJson(response, 200, {
        status: 'OK',
    });
});

app.listen(port, host);

console.log(`Listening at http://localhost:${port}`);

function responseJson(response, status, json) {
    return responseJsonText(response, status, JSON.stringify(json));
}

function responseJsonText(response, status, json) {
    response.writeHead(status, {
        'Content-Type': 'application/json',
    });
    response.write(json);
    response.end();
}

function getSavePath(key) {
    return `./storage/${key}.json`;
}
