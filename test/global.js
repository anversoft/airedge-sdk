const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { after, before } = require('mocha');
const db = require('../src/db');
const secrets = require('./data/secrets');
const settings = require('../src/settings');

chai.use(chaiAsPromised);

before(async () => {
  const oldTimeout = settings.mongodb.socketOptions.serverSelectionTimeoutMS;
  // Utilizzo un tempo basso per garantire l'errore in tempo breve
  settings.mongodb.socketOptions.serverSelectionTimeoutMS = 200;
  chai.expect(db.isInitialized()).to.be.equal(false, 'Controlla che non sia inizializzato');
  let cnt = await db.forceDisconnection();
  chai.expect(cnt).to.be.equal(false, 'Controlla che non abbia eseguito la procedura di disconnessione forzata');
  await chai.expect(db.initialize()).to.be.rejected;
  settings.mongodb.connectionOptions = {};
  await chai.expect(db.initialize()).to.be.rejected;
  delete settings.mongodb.connectionOptions;
  settings.mongodb.socketOptions.serverSelectionTimeoutMS = oldTimeout;
  cnt = await db.initialize(secrets.mongodb);
  chai.expect(cnt).not.to.be.equal(false, 'Controlla che si sia connesso correttamente');
  chai.expect(db.isInitialized()).not.to.be.equal(false,
    'Controlla che la variabile di inizializzazione si sia impostata');
});

after(() => {
  setTimeout(async () => {
    chai.expect(db.isInitialized()).not.to.be.equal(false, 'Controlla che sia inizializzato');
    let cnt = await db.initialize(secrets.mongodb);
    chai.expect(cnt).to.be.equal(false, 'Controlla che non si sia reinizializzato');
    // await db.getCurrentConnection().db.dropDatabase();
    cnt = await db.forceDisconnection();
    chai.expect(cnt).not.to.be.equal(false, 'Controlla che non si sia disconnesso');
    chai.expect(db.isInitialized()).to.be.equal(false,
      'Controlla che la variabile di inizializzazione si sia impostata');
  }, 500);
});
