//http://stackoverflow.com/questions/6011984/basic-ajax-send-receive-with-node-js

var http = require('http'),
      fs = require('fs'),
     url = require('url');

http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    var filename = '';
    var cssPath = /\/css\/([a-zA-z]*\.css)/;
    var jsPath = /\/js\/([a-zA-z]*\.js)/;
    if (cssPath.test(path)) {
        filename = cssPath.exec(path)[1];
        fs.readFile('./views/css/'+filename, function(err, file) {  
            if(err) {  
                // write an error response or nothing here  
                return;  
            }  
            response.writeHead(200, { 'Content-Type': 'text/css' });  
            response.end(file, "utf-8");  
        });
    }
    else if (jsPath.test(path)) {
        filename = jsPath.exec(path)[1];
        fs.readFile('./views/js/'+filename, function(err, file) {  
            if(err) {  
                // write an error response or nothing here  
                return;  
            }  
            response.writeHead(200, { 'Content-Type': 'text/javascript' });  
            response.end(file, "utf-8");  
        });
    }
    else {
        fs.readFile('./views/index.html', function(err, file) {  
            if(err) {  
                // write an error response or nothing here  
                return;  
            }  
            response.writeHead(200, { 'Content-Type': 'text/html' });  
            response.end(file, "utf-8");  
        });
    }
}).listen(8001);
console.log("server initialized");