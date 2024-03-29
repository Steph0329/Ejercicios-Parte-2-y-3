
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ');
}));

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id =  Number(request.params.id)
    const person = persons.find(person => person.id === id)

   if(person) {
    response.json(person)
   } else {
    response.status(404).end()
   }
})

app.get('/info', (request, response) => {
    const fecha = new Date()
    const person = persons.length
    const message = `Phonebook has info for ${person} people <br /> ${fecha}`

    response.send(message)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'error content missing'
        })
    }

    const existPerson = persons.some(person => person.name === body.name)

    if(existPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)
})

const generateId = () => {
    const min = 1;
    const max = 10000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server Running on port 3001')
})