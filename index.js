const  http = require('http');

const app = function (req, res) {
  res.writeHead(200, {'Content-type': 'text/html'});
  res.write('<h1>Hola Mundo JS </h1>');
  res.end();
}

  const server = http.createServer(app);
  
  server.listen(3000, function(){
      console.log('Servidor corriendo en pto 3000')
  })
  