const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', socket => {
  socket.on('updateData', () => {
    io.to(socket.id).emit('updateData', tasks);
  });
  socket.on('addTask', task => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', task => {
    const index = tasks.findIndex(item => item.id == task.id)
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', task);
  });
});

