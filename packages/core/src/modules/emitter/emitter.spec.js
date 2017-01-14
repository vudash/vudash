'use strict'

const Emitter = require(fromSrc('modules/emitter'))

describe('module.emitter', () => {
  const room = 'my-room'
  const broadcastStub = {
    emit: sinon.spy()
  }
  const socketSpy = {
    on: sinon.stub(),
    to: sinon.stub().withArgs(room).returns(broadcastStub)
  }
  const emitter = new Emitter(socketSpy, room)

  it('Instantiation of emitter binds handler', (done) => {
    expect(socketSpy.on.callCount).to.equal(1)
    expect(socketSpy.on.firstCall.args[0]).to.equal('connection')
    done()
  })

  it('Emitted events are saved', (done) => {
    emitter.emit('abc', {id: 'abc'})
    emitter.emit('def', {id: 'def'})
    emitter.emit('ghi', {id: 'ghi'})
    const recentEvents = emitter.getRecentEvents()
    expect(Object.keys(recentEvents)).to.have.length(3)
    done()
  })

  it('Repeated event updates previous event', (done) => {
    emitter.emit('def', {id: 'pqr'})
    const recentEvents = emitter.getRecentEvents()
    expect(Object.keys(recentEvents)).to.have.length(3)
    expect(recentEvents.def).to.equal({id: 'pqr'})
    done()
  })

  it('On connect, socket is joined to a room', (done) => {
    const mockSocket = { id: 'xyz', join: sinon.spy() }
    emitter.clientJoinHandler(mockSocket)
    expect(mockSocket.join.callCount).to.equal(1)
    expect(mockSocket.join.firstCall.args[0]).to.equal(room)
    done()
  })

  it('On connect, socket is joined to a room', (done) => {
    const emit = broadcastStub.emit
    emit.reset()
    const mockSocket = { id: 'xyz', join: sinon.spy() }
    emitter.clientJoinHandler(mockSocket)
    expect(emit.callCount).to.equal(3)
    expect(emit.firstCall.args).to.equal(['abc', {id: 'abc'}])
    expect(emit.secondCall.args).to.equal(['def', {id: 'pqr'}])
    expect(emit.thirdCall.args).to.equal(['ghi', {id: 'ghi'}])
    done()
  })

})
