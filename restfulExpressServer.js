
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000
const express = require('express');
const app = express();

const { Pool } = require('pg');
const pool = new Pool({
    database: "petShop",
});

const petsPath = 'pets.json';

// pool.query("SELECT NOW * pets"), (err, res) => {
//     console.log(err, res);
//     pool.end();
// }

app.use(express.json());

//=============================== Start of GET Request ===============================
//====== Start of GET request using the filesystem ======
// app.get('/pets', (req,res) => {
//     fs.readFile(petsPath, 'utf8', (err, data) => {
//         let pets = JSON.parse(data);
//         let petsJSON = JSON.stringify(pets);
//         res.status(200)
//             .setHeader('Content-Type', 'application.json')
//             .end(petsJSON);
//     })
// });

// app.get('/pets/:id', (req,res) => {
//     fs.readFile(petsPath, 'utf8', (err, data) => {
//         let pets = JSON.parse(data);
//         if (req.params.id < 0 || req.params.id > pets.length - 1) {
//             res.status(404)
//                 .setHeader('Content-Type', 'text/plain')
//                 .end('Not Found');
//         } else {
//             let petsJSON = JSON.stringify(pets[req.params.id]);
//             res.status(200)
//                 .setHeader('Content-Type', 'application.json')
//                 .end(petsJSON);
//         }
//     });
// });
//====== End of GET request using the filesystem ======

//====== Start of GET request using a Database ======
app.get('/pets', (req, res) => {
    pool
        .query("SELECT * FROM pets", (err, data) => {
            res.json(data.rows)
        });
});

app.get('/pets/:id', (req, res) => {
    let petID = req.params.id;
    pool
        .query("SELECT * FROM pets WHERE id = $1", [petID], (err, data) => {
            if (data.rows[0] === undefined) {
                res.status(404)
                    .setHeader("Content-Type","text/plain")
                    .end("Not Found");
            } else {
                res.send(data.rows[0]);
            }
        });
});
//====== End of GET request using a Database ======
//============================= End of GET Request ================================


//=============================== Start of POST Request ============================
// ====== Start of POST request using the filesystem ======
// app.post('/pets', (req,res) => {
//     const body = req.body;
//     body['age'] = Number(body['age']);
//     if (body.name && body.kind && body.age) {
//         let petsJSON = fs.readFileSync(petsPath, 'utf8');
//         let pets = JSON.parse(petsJSON);
//         pets.push(body);
//         petsJSON = JSON.stringify(pets);
//         fs.writeFile(petsPath, petsJSON, (err) => {
//             res.status(200)
//                 .setHeader('Content-Type', 'application/json')
//                 .end(JSON.stringify(req.body));
//         });
//     } else {
//         res.status(400)
//             .setHeader('Content-Type', 'text/plain')
//             .end('When adding a new pet to the database, please include the name, kind, and age.');
//     }  
// });
//====== End of POST request using the filesystem ======

//====== Start of POST request using a Database ======
app.post("/pets", (req, res) => {
    const { age, name, kind } = req.body;
    pool
        .query(
            "INSERT INTO pets(age, name, kind) VALUES($1, $2, $3) RETURNING *", [
                age, name, kind,
            ],
            (err, result) => {
                res.status(201);
                res.json(result.rows[0]);
            })
    
})
//====== End of POST request using a Database ======
//================================ End of POST Request ===============================


//=============================== Start of DELETE Request ============================
//====== Start of DELETE request with the file system ======
// app.delete('/pets/:id', (req,res) => {
//     fs.readFile(petsPath, 'utf8', (err, data) => {
//         let pets = JSON.parse(data);
//         if (req.params.id < 0 || req.params.id > pets.length - 1) {
//             res.status(404)
//                 .setHeader('Content-Type', 'text/plain')
//                 .end('There is no pet at the location you specified. Please verify the pet your want to delete.');
//         } else {
//             let removedPet = pets.splice(req.params.id, 1);
//             let petsJSON = JSON.stringify(pets);
//             fs.writeFile(petsPath, petsJSON, (err) => {
//                 res.status(200)
//                     .setHeader('Content-Type', 'application/json')
//                     .send(removedPet[0]);
//             });
//             // res.status(200)
//             //     .setHeader('Content-Type', 'application.json')
//             //     .end(removedPet);
//         }
//     });
// });
//====== End of DELETE request with the flie system ======

//====== Start of DELETE request with a Database ======
app.delete('/pets/:id', (req, res) => {
    const petID = req.params.id;
    pool
        .query("DELETE FROM pets WHERE id = $1 RETURNING *", [petID], (err, result) => {
            if (err || result.rowCount === 0) {
                res.status(400)
                    .setHeader("Content-Type","text/plain")
                    .end("Could not delete. No pets exist with that ID.");
            } else {
                //res.send(data.rows[0]);
                res.json(result.rows[0]);
            }
        });
});
//====== End of DELETE request with a Database ======
//================================ END of DELETE Request ==============================


//=============================== START of PATCH Request ==============================
//====== Start of PATCH request with a Database ======
app.patch("/pets/:id", (req,res) => {
    const { age, name, kind } = req.body;
    const { id } = req.params;
    const query = `
        UPDATE pets SET
            age = COALESCE($1, age),
            name = COALESCE($2, name),
            kind = COALESCE($3, kind)
        WHERE id = $4 
        RETURNING *
    `;
    pool.query(query, [age, name, kind, id], (err, result) => {
        res.status(200);
        res.send(result.rows[0]);
    });
});
//===== End of PATCH request with a Database ======
//=============================== END of PATCH Request =================================


//Express server listening on port 8000
app.listen(port);