'use strict'

const chalk = require('chalk')

class Emitter {
  constructor (socketio, room) {
    this.io = socketio
    this.room = room
    this.recentEvents = {}
    this.io.on('connection', (socket) => {
      this.clientJoinHandler(socket)
    })
  }

  clientJoinHandler (socket) {
    socket.join(this.room)
    const historicalEvents = this.recentEvents
    const eventIds = Object.keys(historicalEvents)
    console.log(`Client ${chalk.bold.green(socket.id)} 
      connected to ${chalk.bold.red(this.room)}. 
      Receives ${chalk.bold.yellow(eventIds.length)} historical events.`)
    eventIds.map(eventId => {
      this.emit(eventId, historicalEvents[eventId], true)
    })
  }

  emit (event, data, historical) {
    this.io.to(this.room).emit(event, data)
    if (!historical) {
      this.recentEvents[event] = data
    }
  }
}

module.exports = Emitter
