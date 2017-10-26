'use strict'

const Emitter = require('modules/emitter')
const { expect } = require('code')
const { stub, spy } = require('sinon')

describe('module.emitter', () => {
  const room = 'my-room'
  const broadcastStub = {
    emit: spy()
  }
  const socketSpy = {
    on: stub(),
    to: stub().withArgs(room).returns(broadcastStub)
  }
  const emitter = new Emitter(socketSpy, room)

  it('Instantiation of emitter binds handler', () => {
    expect(socketSpy.on.callCount).to.equal(1)
    expect(socketSpy.on.firstCall.args[0]).to.equal('connection')
  })

  it('Emitted events are saved', () => {
    emitter.emit('abc', {id: 'abc'})
    emitter.emit('def', {id: 'def'})
    emitter.emit('ghi', {id: 'ghi'})
    const recentEvents = emitter.getRecentEvents()
    expect(Object.keys(recentEvents)).to.have.length(3)
  })

  it('Repeated event updates previous event', () => {
    emitter.emit('def', {id: 'pqr'})
    const recentEvents = emitter.getRecentEvents()
    expect(Object.keys(recentEvents)).to.have.length(3)
    expect(recentEvents.def).to.equal({id: 'pqr'})
    
  })

  it('On connect, socket is joined to a room', () => {
    const mockSocket = { id: 'xyz', join: spy() }
    emitter.clientJoinHandler(mockSocket)
    expect(mockSocket.join.callCount).to.equal(1)
    expect(mockSocket.join.firstCall.args[0]).to.equal(room)
  })

  it('On connect, socket is joined to a room', () => {
    const emit = broadcastStub.emit
    emit.reset()
    const mockSocket = { id: 'xyz', join: spy() }
    emitter.clientJoinHandler(mockSocket)
    expect(emit.callCount).to.equal(3)
    expect(emit.firstCall.args).to.equal(['abc', {id: 'abc'}])
    expect(emit.secondCall.args).to.equal(['def', {id: 'pqr'}])
    expect(emit.thirdCall.args).to.equal(['ghi', {id: 'ghi'}])
  })

})
