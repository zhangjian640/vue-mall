var http = require('http')
var url = require('url')
var util = require('util')
var fs = require('fs')


let server = http.createServer((req, res) => {
  var pathname = url.parse(req.url).pathname
  fs.readFile(pathname.substring(1), (err, data)=>{
    if (err) {
      res.writeHead(404, {
        'Content-type':'text/html'
      })
    } else {
      res.writeHead(200, {
        'Content-type':'text/html'
      })
      res.write(data.toString())
    }
    res.end()
  })

}).listen(3000, () => {
  console.log('demo-server running at 3000')
})
