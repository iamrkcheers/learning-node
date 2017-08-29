//console.log('HELLO WORLD');

//console.log(process.argv);
/*var sum = 0;
for (var i = 2; i < process.argv.length; i++)
    sum += Number(process.argv[i]);
console.log(sum);*/

/*var fs = require('fs');
var buffer = fs.readFileSync(process.argv[2]); // or fs.readFileSync(process.argv[2],'utf8') will return a string, thus, eliminating the need of the next step
var str = buffer.toString();
console.log(str.match(/\n/g).length);*/

/*var fs = require('fs');
fs.readFile(process.argv[2],'utf8',function(error,data){
    if (error)
        console.log(error);
    else
        console.log(data.split('\n').length - 1);
});*/

/*var fs = require('fs');
var path = require('path');
fs.readdir(process.argv[2],function(error,list){
    if (error)
        console.log(error);
    else {
        list.forEach(function(item){
            var ext = '.' + process.argv[3];
            if (path.extname(item) == ext)
                console.log(item);
        });
    }
});*/

/*var fnc = require('./myModule.js');
var callback = function(error,data) {
    if (error)
        return console.log(error);
    data.forEach(function(item){
        console.log(item);
    });
};
fnc(process.argv[2],process.argv[3],callback);*/ // linked with myModule.js I

/*var http = require('http');
// response is a stream object that emits events (eg: 'data', 'error', 'end' etc); response (stream) object has a method called setEncoding(), which when passed with 'utf8', makes the 'data' events emit strings rather than buffer object.
http.get(process.argv[2],function(response){
    response.setEncoding('utf8');
    response.on('data',function(data){
        console.log(data);
    });
    response.on('error',function(error){
        console.log(error);
    });
}).on('error',function(error){
    console.log(error);
});*/

/*var http = require('http');
var bl = require('bl');
var concatStream = require('concat-stream');
http.get(process.argv[2],function(response){
    response.setEncoding('utf8');
    var str = '';
    response.on('data',function(data){
        str += data;
    });
    response.on('error',function(error){
        console.log(error);
    });
    response.on('end',function(){
        console.log(str.length);
        console.log(str);
    }); // first
    response.pipe(bl(function(error,data){
        if (error)
            return console.log(error);
        data = data.toString();
        console.log(data.length);
        console.log(data);
    })); // second
    response.pipe(concatStream(function(data){
        data = data.toString();
        console.log(data.length);
        console.log(data);
    })); // third
}).on('error',function(error){
    console.log(error);
});*/

/*var http = require('http');
var bl = require('bl');
var num = 0;
var arr = []
var fnc = function(data,i) {
    num++;
    arr[i] = data;
    if (num === 3)
        arr.forEach(function(item){
            console.log(item);
        });
};
http.get(process.argv[2],function(response){
    response.pipe(bl(function(error,data){
        if (error)
            return console.log(error);
        fnc(data.toString(),0);
    }));
}).on('error',function(error){
    console.log(error);
});
http.get(process.argv[3],function(response){
    response.pipe(bl(function(error,data){
        if (error)
            return console.log(error);
        fnc(data.toString(),1);
    }));
}).on('error',function(error){
    console.log(error);
});
http.get(process.argv[4],function(response){
    response.pipe(bl(function(error,data){
        if (error)
            return console.log(error);
        fnc(data.toString(),2);
    }));
}).on('error',function(error){
    console.log(error);
});
// first
var httpFnc = function(i) {
    http.get(process.argv[2 + i],function(response){
        response.pipe(bl(function(error,data){
            if (error)
                return console.log(error);
            arr[i] = data.toString();
            num++;
            if (num === 3)
                arr.forEach(function(item){
                    console.log(item);
                });
        }));
    }).on('error',function(error){
        console.log(error);
    });;
};
for (var i = 0; i < 3; i++)
    httpFnc(i);*/
// second

/*var net = require('net');
var time = require('strftime');
var server = net.createServer(function(socket){
    var data = time('%Y-%m-%d %H:%M',new Date()) + '\n';
    socket.write(data);
    socket.end();
});
// createServer takes in a listener function as an argument that constantly listens for connections.
// socket is an object that consists of a lot of meta-data about the established connection; is 2-way-streamed ie can be read from & can be written to
server.listen(process.argv[2]);*/

/*var http = require('http');
var fs = require('fs');
var server = http.createServer(function(request,response){
    response.writeHead(200,{'content-type':'text/plain'});
    var source = fs.createReadStream(process.argv[3]);
    source.pipe(response);
});
server.listen(process.argv[2]);*/

/*var http = require('http');
var map = require('through2-map');
var server = http.createServer(function(request,response){
    response.writeHead(200,{'Content-Type':'text/plain'});
    if (request.method == 'POST')    
        request.pipe(map(function(chunk){
            return chunk.toString().toUpperCase();
        })).pipe(response);
    else
        response.end('Send me a POST !'); // return response.end('Send me a POST !');
});
// through2-map converts chunks of data while being transferred from one stream to another
server.listen(process.argv[2]);*/

var http = require('http');
var url = require('url');
var server = http.createServer(function(req,res){
    if (req.method == 'GET') {
        res.writeHead(200,{'Content-Type':'application/json'});
        var obj = url.parse(req.url,true);
        if (obj.pathname == '/api/parsetime') {
            var json = {};
            var date = new Date(obj.query.iso);
            json.hour = date.getHours();
            json.minute = date.getMinutes();
            json.second = date.getSeconds();
            res.end(JSON.stringify(json));
        }
        else if (obj.pathname == '/api/unixtime') {
            var json = {};
            var date = new Date(obj.query.iso);
            json.unixtime = date.getTime();
            res.end(JSON.stringify(json));
        }
    }
    else
        return res.end('Send me a GET request !');
});
server.listen(process.argv[2]);
// JSON - JS Obj Notification is the normal object we deal, day to day, in JS (var obj = {}); However, while communicating with server data can only be sent in String format; Hence, while sending - JSON.stringify, while receiving - JSON.parse (converts string back to JSON)
// new Date() - current date in normal format
// new Date.toISOString() - current date in ISO format
// new Date('date-in-ISO-format') - date in normal format
// var date = new Date(); date.getTime() - time since 1970
// var date = new Date(); date.getHours(); date.getMinutes(); date.getSeconds() etc