const net = require('net')
const path = require('path')

const server = net.createServer()

server.on('connection', (socket) => {
  socket.setEncoding('utf8')

  const address = server.address();
  console.log(address)

  socket.on('data', (data) => {
    console.log('Data sent to server : ' + data);

    const response = {
      message: 'pong'
    }

    socket.write(JSON.stringify(response))
  })
})

server.listen(path.join(process.cwd(), 'socket', 'render.sock'))

process.on('SIGINT', () => {
  server.close()
  process.exit()
})
