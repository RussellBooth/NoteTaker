//importing express.js,
const express = require('express');

//import built-in node.js package to resolve path of files located on the server
const path = require('path');

//import the file save and write package
const fs = require('fs');

//import random uuid generator
const { randomUUID } = require('crypto');

//specify which port the express.js server will run
const PORT = process.env.PORT || 3001;

//initialize an instance of express.js
const app = express();

//static middleware pointing to the public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//GET request for notes from html page
app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET request for notes from the json file saved notes
app.get('/api/notes', (req,res) =>
    res.sendFile(path.join(__dirname, '/notes/db.json'))
);

//POST request to add new notes with unique ids
app.post('/api/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/notes/db.json'));
    //log POST request was received
    console.info(`${req.method} request received to add to notes`);

    //deconstrucring assignments for items of the req.body
    const { title, text } = req.body;

    //iff require properties present, variable newNotes will be new object saved
    if (title && text) {
        const newNote = {
            title,
            text,
            noteID: randomUUID(),
        };

    //to read existing reviews
    fs.readFile('./notes/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            //converting string into JSON object
            const parsedNotes = JSON.parse(data);

            //adding a new note
            parsedNotes.push(newNote);

            //write new notes tto file
            fs.writeFile(
                './notes/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully added new note.')
            );
        }
});

    const response = {
        status: 'success',
        body: newNote,
};

    console.log(response);
    res.status(201).json(response);
    } else {
        res.status(500).json('Error posting new note');
    }
});


//GET request for if something goes wrong, return to title page (* is the wildcard)
app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//specify where express.js will listen for incoming connections on the specified port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);

module.exports = app;