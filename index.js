require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

const Person = require('./models/person.js')

/*
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
*/

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const info = `Phonebook has info for ${persons.length} people <br/> ${currentDate.toUTCString()}`

  response.send(info)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === '') {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (body.number === '') {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  /*let nameExists = persons.some(person => person.name === body.name)

  if(nameExists){
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }*/
    
  //const id = Math.floor(Math.random() * 100 + 1)
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
