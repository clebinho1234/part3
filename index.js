const express = require('express')
const morgan = require('morgan')
const app = express()

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

app.use(express.static('dist'))

morgan.token('data', function getData(request, response) {
  if(request.method === 'POST'){
      return JSON.stringify(request.body)
  }
})

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(morgan(':method :url :status :res[content-lenght] :response-time ms :data'))
  
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const info = `Phonebook has info for ${persons.length} people <br/> ${currentDate.toUTCString()}`

  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.statusMessage = "Person not found";
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  let nameExists = persons.some(person => person.name === body.name)

  if(nameExists){
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }
    
  const id = Math.floor(Math.random() * 100 + 1)
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  persons = persons.concat(person)

  response.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
