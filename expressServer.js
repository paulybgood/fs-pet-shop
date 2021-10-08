const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000
const express = require('express');
const app = express();

app.use(express.json());

let petsPath = './pets.json';

app.get('/pets', (req,res) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        let pets = JSON.parse(data);
        let petsJSON = JSON.stringify(pets);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.end(petsJSON);
    })
});

app.get('/pets/:id', (req,res) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        let pets = JSON.parse(data);
        if (req.params.id < 0 || req.params.id > pets.length) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not Found');
        } else {
            let petsJSON = JSON.stringify(pets[req.params.id]);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application.json');
            res.end(petsJSON);
        }
    });
});

app.listen(port);



/*const server = http.createServer((req, res) => {
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
*/