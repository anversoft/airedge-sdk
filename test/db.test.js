const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const db = require('../src/db');

chai.use(chaiAsPromised);

describe('Testing DB Connections', () => {
  it('checks if client is connected', async () => {
    chai.expect(db.isInitialized()).not.to.be.equal(false);
    const status = db.getCurrentConnection().readyState;
    chai.expect(status).to.be.equal(1);
  });

  it('write configuration', async () => {
    const _id = '123456';
    await db.writeConfiguration({
      uuid: _id,
      name: 'Prova123456',
      type: 'Aier2',
      version: '1.0.0',
      emails: ['test@test.com'],
      devices: {
        a: {
          name: 'a',
        },
        b: {
          name: 'b',
        },
      },
      version_features: {
        test: true,
      },
    });

    const result = await db.readConfiguration();
    await chai.expect(result.uuid === _id).to.be.equal(true);
  });

  it('send alarm', async () => {
    const send = {
      alarm: 'Test alarm',
      status: true,
      current_config: {},
      device: 'C3 Elet',
      data: {},
    };

    await db.writeAlarm(send);
  });

  it('send log', async () => {
    const send = {
      data: {
        test: 'data',
      },
    };

    await db.writeLog(send);
  });

  it('send schedule', async () => {
    const send = {
      name: 'test',
    };

    await db.writeSchedule(send);
  });
});
