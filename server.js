const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

server = app.listen(8000, () => {
  console.log(`Server is running...`);
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

const io = socket(server);

io.on('connection', socket => {
  console.log(`New client! I am sending: ${tasks} to id: ${socket.id}`);
  socket.emit('updateData', tasks);
  socket.on('addTask', task => {
    console.log(`Dodaje ${JSON.stringify(tasks)} do : ${socket.id}`);
    tasks.push(task);
  });
  socket.on('removeTask', id => {
    tasks.filter(item => item.id !== id)
    socket.broadcast.emit('removeTask', id);
  });
});

