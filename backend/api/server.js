import http from 'node:http'

const port = process.env.PORT ? Number(process.env.PORT) : 4080

const server = http.createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ status: 'ok', service: 'lvgl-ui-builder-backend' }))
})

server.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`)
})
