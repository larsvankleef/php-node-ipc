const net = require('net')
const path = require('path')
const { performance } = require('perf_hooks')

const envRequire = process.env.NODE_ENV === 'production' ? require : require('import-fresh')

const server = net.createServer()

server.on('connection', (socket) => {
  socket.setEncoding('utf8')

  socket.on('data', (data) => {
    const start = performance.now()

    const { component, props } = JSON.parse(data)
    const folder = path.join(path.dirname(__dirname), 'www', 'kaliberjs', 'includes', component)
    const renderer = envRequire(path.join(folder, `${component}.ssr.js`))

    const result = renderer(props)
    socket.write(result)

    const end = performance.now()

    console.log(`[${process.env.NODE_ENV || 'development'}] 🎉 rendered ${component}, took ${(end - start)} ms`)
  })
})

server.listen(path.join(process.cwd(), 'socket', 'render.sock'))

process.on('SIGINT', () => {
  server.close()
  process.exit()
})
