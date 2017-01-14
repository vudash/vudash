'use strict'

class Emitter {

  constructor (socketio, room) {
    this.io = socketio
    this.room = room
    this.recentEvents = {}
    this.io.on('connection', this.clientJoinHandler.bind(this))
  }

  clientJoinHandler (socket) {
    socket.join(this.room)
    const eventHistory = this.getRecentEvents()
    const eventIds = Object.keys(eventHistory)
    console.log(`Client ${socket.id} connected to ${this.room}. Receives ${eventIds.length} historical events.`)
    eventIds.map((eventId) => {
      this.emit(eventId, eventHistory[eventId], true)
    })
  }

  emit (event, data, historical) {
    this.io.to(this.room).emit(event, data)
    if (!historical) {
      this.recentEvents[event] = data
    }
  }

  getRecentEvents () {
    return this.recentEvents
  }
}

module.exports = Emitter
