var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function(){
	console.log('MAP started on port: 3000');
});
app.get('/', function(req, res){
	res.sendFile(__dirname + '/map/index.html');
	app.use(express.static('.'));
});

var visitors = {};
io.on('connection', function(socket){
	socket.on('new_user', function(data){
		if(parseInt(Object.keys(visitors).length) > 0)
			socket.emit('already', {visitors: visitors});
		visitors[socket.id] = data.pos;
		io.emit('connected', { pos: data.pos, users_count: Object.keys(visitors).length });
		console.log('someone CONNECTED:');
		console.log(visitors);
	});
	socket.on('disconnect', function(){
		if(visitors[socket.id]){
			var todel = visitors[socket.id];
			delete visitors[socket.id];
			io.emit('disconnected', { del: todel, users_count: Object.keys(visitors).length });
		}
		console.log('someone DISCONNECTED:');
		console.log(visitors);
	});
}); 
