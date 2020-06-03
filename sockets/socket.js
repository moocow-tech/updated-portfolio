module.exports = (io) => {
    var socketCount = 0
    io.sockets.on('connection', function (socket) {
        // Socket has connected, increase socket count
        socketCount++
        // Let all sockets know how many are connected
        io.sockets.emit('users connected', socketCount)

        socket.on('disconnect', function () {
            // Decrease the socket count on a disconnect, emit
            socketCount--
            io.sockets.emit('users connected', socketCount)
        })

        socket.on('refresh', function(data){
            io.sockets.emit('refresh', data)
        })
    

    })

};