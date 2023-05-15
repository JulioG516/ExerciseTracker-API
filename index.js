const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const bodyParser = require('body-parser');


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Parse URL-encoded bodies and JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Declare our database
let users = [];
let logs = [];
let id = 0;

let logsMap = new Map();

app.post("/api/users", (req, res) => {
  let USERNAME = req.body.username;

  ++id;
  let user = {
    username: USERNAME,
    _id: `${id}`
  }

  users.push(user);
  res.send(user);
})

app.post("/api/users/:_id/exercises", (req, res) => {
  const formData = req.body // description, duration optional date

  let ID = req.params._id
  const userObject = users.find(user => user._id === ID)
  const logObject = logs.find(user => user._id === ID)

  let previousLogs = logsMap?.get(ID) ?? [];


  // console.log(previousLogs)



  if (formData.date === null || formData.date === '' || formData.date === undefined) {
    let DATE = new Date().toDateString();

    const log = {
      description: formData.description,
      duration: parseInt(formData.duration),
      date: DATE
    }
    previousLogs.push(log);
    logsMap.set(ID, previousLogs);

    // console.log("=====LOGS MAPS=====")
    // console.log(logsMap)


    let exercise = {
      _id: userObject._id,
      username: userObject.username,
      date: DATE,
      duration: parseInt(formData.duration),
      description: formData.description
    }
    res.json(exercise)
  }
  else {
    let DATE = new Date(formData.date); // TODO ERRO AQUI
    DATE = DATE.toDateString();

    const log = {
      description: formData.description,
      duration: parseInt(formData.duration),
      date: DATE
    }
    previousLogs.push(log);
    logsMap.set(ID, previousLogs);

    // console.log("=====LOGS MAPS=====")
    // console.log(logsMap)



    let exercise = {
      _id: userObject._id,
      username: userObject.username,
      date: DATE,
      duration: parseInt(formData.duration),
      description: formData.description
    }
    res.json(exercise)

  }


})

app.get("/api/users/:_id/logs", (req, res) => {
  let ID = req.params._id
  
  // Retrieve previous data
  const userObject = users.find(user => user._id === ID)
  let logs = logsMap.get(ID) ?? [];



  if (req.query.from && req.query.to) {
      logs = logs.filter(i => Date.parse(i.date) > Date.parse(req.query.from)) && logs.filter(i         => Date.parse(i.date) < Date.parse(req.query.to));
  }


  if (req.query.limit) {
    logs = logs.slice(0, req.query.limit);
  }

  if (!req.query.from && !req.query.to && !req.query.limit) {
    logs = logs;
  }


  // Check how many logs have for that user
  let COUNT = logs.length

  res.json({
    username: userObject.username,
    count: COUNT,
    _id: ID,
    log: logs
  })

})

app.get("/api/users", (req, res) => {
  res.json(users);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
