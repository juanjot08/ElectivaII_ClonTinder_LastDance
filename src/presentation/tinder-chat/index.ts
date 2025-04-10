import { Server } from 'socket.io';

const CHAT_PORT = 4000;

const io = new Server({
  cors: {
    origin: '*',
  },
  connectionStateRecovery: {}
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('message', (message) => {
    console.log('Mensaje recibido:', message);

    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

io.listen(CHAT_PORT);
console.log(`Servicio de chat corriendo en ws://localhost:${CHAT_PORT}`);