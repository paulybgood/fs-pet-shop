const fs = require('fs');
const path = require('path');

const http = require('http');
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    let petsPath = './pets.json';
    if (req.method === 'GET' && req.url === '/pets') {
        fs.readFile(petsPath, 'utf8', (err, data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application.json')
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/pets/0') {
        fs.readFile(petsPath, 'utf8', (err, data) => {
            let pets = JSON.parse(data);
            let petsJSON = JSON.stringify(pets[0]);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(petsJSON);
        });
    } else if (req.method === 'GET' && req.url === '/pets/1') {
        fs.readFile(petsPath, 'utf8', (err, data) => {
            let pets = JSON.parse(data);
            let petsJSON = JSON.stringify(pets[1]);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(petsJSON);
        });
    } else if (req.method === 'GET' && req.url === '/pets/2') {
        fs.readFile(petsPath, 'utf8', (err,data) => {
            if (err) {
                console.error(err.stack);
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found');
            }
        })
    } else if (req.method === 'GET' && req.url === '/pets/-1') {
        fs.readFile(petsPath, 'utf8', (err,data) => {
            if (err) {
                console.error(err.stack);
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found');
            }
        });
    }
});

server.listen(port);