'use strict'

const DashboardBuilder = require(fromTest('util/dashboard.builder'))
const WidgetBuilder = require(fromTest('util/widget.builder'))
const Dashboard = require(fromSrc('modules/dashboard'))

describe('shared-config', () => {
  let io

  before((done) => {
    io = {
      on: sinon.stub(),
      to: sinon.stub().returns({ emit: sinon.stub() })
    }
    done()
  })

  after((done) => {
    io.on.reset()
    io.to.reset()
    done()
  })

  context('Shared Config', () => {
    let dashboard

    before((done) => {
      const sharedConfigKey = 'some-key'
      const widgetA = WidgetBuilder.create().withOptions({ uniqueParam: 'A', _extends: sharedConfigKey }).build()
      const widgetB = WidgetBuilder.create().withOptions({ uniqueParam: 'B', _extends: sharedConfigKey }).build()

      const descriptor = DashboardBuilder.create()
      .withSharedConfig(sharedConfigKey, { foo: 'bar' })
      .addWidget(widgetA)
      .addWidget(widgetB)
      .build()

      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      done()
    })

    it('Removes setup data', (done) => {
      expect(dashboard.getWidgets()[0].config._extends).not.to.exist()
      expect(dashboard.getWidgets()[1].config._extends).not.to.exist()
      done()
    })

    it('Augments config with shared config', (done) => {
      expect(dashboard.getWidgets()[0].config.foo).to.equal('bar')
      expect(dashboard.getWidgets()[1].config.foo).to.equal('bar')
      done()
    })

    it('Individual widgets have unshared config', (done) => {
      expect(dashboard.getWidgets()[0].config.uniqueParam).to.equal('A')
      expect(dashboard.getWidgets()[1].config.uniqueParam).to.equal('B')
      done()
    })
  })

  context('Non-existent shared config', () => {
    const sharedConfigKey = 'doesnt-exist'

    it('If shared config cannot be found', (done) => {
      const widget = WidgetBuilder.create().withOptions({ _extends: sharedConfigKey }).build()

      const descriptor = DashboardBuilder.create()
      .addWidget(widget)
      .build()

      const fn = () => { return new Dashboard(descriptor, io) }
      expect(fn).to.throw(Error, `Shared configuration ${sharedConfigKey} does not exist.`)
      done()
    })
  })

  context('Deep copy', () => {
    let dashboard

    before((done) => {
      const sharedConfigKey = 'deep-conf'
      const widget = WidgetBuilder.create()
      .withOptions({
        _extends: sharedConfigKey,
        so: {
          much: {
            of: {
              deep: 'overrideme'
            }
          }
        }
      }).build()

      const descriptor = DashboardBuilder.create()
      .withSharedConfig(sharedConfigKey, { so: { much: { of: { deep: 'copy' } } } })
      .addWidget(widget)
      .build()

      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      done()
    })

    it('Peforms a deep merge', (done) => {
      expect(dashboard.getWidgets()[0].config.so.much.of.deep).to.equal('copy')
      done()
    })
  })
})
