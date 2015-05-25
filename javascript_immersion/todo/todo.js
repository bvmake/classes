//http://stackoverflow.com/questions/6011984/basic-ajax-send-receive-with-node-js
//http://codeforgeek.com/2014/07/node-sqlite-tutorial/
//https://github.com/mapbox/node-sqlite3/wiki/API

//DISCLAIMER: this is my first node app. I would not treat this as THE WAY to write node. For that, you might try howtonode.org.
//  I threw this together in a hurry with internet searches, duck tape, and bailing wire.
//  The point of this is more to illustrate what can be done than how to do it.

var http = require('http'),
      fs = require('fs'),
     url = require('url'),
     sqlite3 = require('sqlite3').verbose()/*,
     qs = require('querystring')*/;

http.createServer(
/**
    @param {object} request a http.IncomingMessage 
    @param {object} response a http.ServerResponse
*/
function(request, response){
    var path = url.parse(request.url).pathname;
    var filename = '';
    var cssPath = /\/css\/([a-zA-z0-9]*\.css)/;
    var jsPath = /\/js\/([a-zA-z0-9]*\.js)/;
    var todoPath = /\/todos\/([a-zA-z\-0-9]*)/;

    if (request.method == 'POST' && path == '/todo') {
        console.log('receieved request to create todo');
        var body = '';
        var todo = null;
        request.on('data', function (data) {
            console.log('Buffering data');

            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function () {
            //var post = qs.parse(body);

            console.log('Parsing data');

            todo = JSON.parse(body);

            if (todo) {

                var db = new sqlite3.Database('todo.sqlite');

                db.serialize(function() {
                    var stmt = db.prepare("INSERT INTO todos (id, todo) VALUES (?,?);");
                    stmt.run(todo.id, todo.todo);
                    stmt.finalize();

                    //TODO: How do we check for errors here? try/catch?

                    //This is blocking. To make it non-blocking, stick it outside request.on
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end();
                });

                //Passing a parameter to this function assigns a close handler
                db.close();
            }
        });
    }
    if (path == '/todos') {
        console.log('Received request for todos')
        var todos = [];

        var db = new sqlite3.Database('todo.sqlite');

        db.serialize(function() {

            var error = '';

            db.run("CREATE TABLE if not exists todos (id TEXT, todo TEXT);");

            // Maybe should have used db.all here?
            db.each("SELECT id, todo FROM todos;", 
                function (err, row) {
                    //Row callback
                    if (err) {
                        console.log(err);
                        error = "Error occurred";
                    }
                    else {
                        console.log(row.id + ": " + row.todo);
                        todos.push({id: row.id, todo: row.todo});
                    }
                },
                function () {
                    //Completion callback
                    if (error) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify(todos), 'utf-8');
                    }
                });
        });

        //Passing a parameter to this function assigns a close handler
        db.close();
    }
    else if (request.method == 'DELETE' && todoPath.test(path)) {

        var id = todoPath.exec(path)[1];

        var db = new sqlite3.Database('todo.sqlite');

        db.serialize(function() {      
            var stmt = db.prepare("DELETE FROM todos WHERE id = ?;");
            stmt.run(id);

            //TODO: How do we check for errors here? try/catch?

            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end();
        });
    }
    else if (cssPath.test(path)) {
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
        fs.readFile('./views/index2.html', function(err, file) {  
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