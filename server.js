const fs = require('fs');
const path = require('path');

const express = require('express');
const {notes} = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



function filterByQuery(query, notesArray){
    let filteredResults = notesArray;
    if(query.title){
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.text){
        filteredResults = filteredResults.filter(note => note.text === query.text);
    }
    return filteredResults;
}

function createNewNote (body, notesArray){
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}
  

function validateData(note) {
    if (!note.title || typeof note.title !== 'string'){
        return false;
    }
    if (!note.text || typeof note.text !== 'string'){
        return false;
    }
    return true;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//app.get('/api/notes/:id', (req, res) => {
    //const result = findById(req.params.id, notes);
    //if (result){
        //res.json(result);
    //}else{
        //res.send(404);
    //}
//});  

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    if (!validateData(req.body)){
        res.status(400).send('Please formate notes properly!');
    }else{
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

//app.delete('/api/notes/:id', (req, res) => {
    //const notesIndex = parseInt(req.params.id) -1;
    // ids start at 1 instead of 0
    //notes.splice(notesIndex, 1)

    //writeIntoNotes(notes);

    //res.status(200).json({ message: 'success' })
//})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
  