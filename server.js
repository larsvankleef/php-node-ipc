const net = require('net')
const path = require('path')
const fs = require('fs')
const { performance } = require('perf_hooks')

const envRequire = process.env.NODE_ENV === 'production' ? require : require('import-fresh')
const socketFile = path.join(process.cwd(), 'socket', 'render.sock')

const server = net.createServer()

server.on('connection', (socket) => {
  socket.setEncoding('utf8')

  socket.on('data', (data) => {
    try {
      const start = performance.now()
      const { folder, component, props } = JSON.parse(data)

      const renderer = envRequire(path.join(folder, `${component}.ssr.js`))

      socket.write(renderer(props))

      const end = performance.now()

      console.log(`[${process.env.NODE_ENV || 'development'}] 🎉 rendered ${component}, took ${(end - start)} ms`)

    } catch (e) {
      console.error(e)
      const response = process.env.NODE_ENV === 'production' ? '': e.toString()
      socket.write(response)
    }
  })
})

try {
  server.listen(socketFile)
} catch (e) {
  console.error(e)
}

process.on('uncaughtException', (e) => {
  console.error(e)
  fs.unlinkSync(socketFile)
})

process.on('SIGINT', () => {
  server.close()
  process.exit()
})
