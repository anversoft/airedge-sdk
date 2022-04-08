/* eslint-disable max-len */
const mongoose = require('mongoose');
const settings = require('./settings');
const dbEvents = require('./db_events');
const utils = require('./utils');
const configSchema = require('./schema/config.schema');
const logSchema = require('./schema/log.schema');
const alarmSchema = require('./schema/alarm.schema');
const scheduleSchema = require('./schema/schedule.schema');

const configModel = mongoose.model(settings.mongodb.collectionNames.configs, configSchema);
const logModel = mongoose.model(settings.mongodb.collectionNames.logs, logSchema);
const scheduleModel = mongoose.model(settings.mongodb.collectionNames.schedules, scheduleSchema);

/**
 * Variabile che determina se il databse è inizializzato o no
 */
let initialized = false;

/**
 * Togli la sottoiscrizione agli eventi
 */
function unsubscribeEvents() {
  mongoose.connection.off('connecting', dbEvents.onConnectingEvent)
    .off('connected', dbEvents.onConnectedEvent)
    .off('disconnecting', dbEvents.onDisconnectingEvent)
    .off('disconnected', dbEvents.onDisconnectedEvent)
    .off('close', dbEvents.onCloseEvent)
    .off('reconnected', dbEvents.onReconnectedEvent)
    .off('error', dbEvents.onErrorEvent)
    .off('fullsetup', dbEvents.onFullSetupEvent)
    .off('all', dbEvents.onAllEvent)
    .off('reconnectFailed', dbEvents.onReconnectFailedEvent);
}

/**
 * Inserisci la sottoiscrizione agli eventi
 */
function subscribeEvents() {
  mongoose.connection.on('connecting', dbEvents.onConnectingEvent)
    .on('connected', dbEvents.onConnectedEvent)
    .on('disconnecting', dbEvents.onDisconnectingEvent)
    .on('disconnected', dbEvents.onDisconnectedEvent)
    .on('close', dbEvents.onCloseEvent)
    .on('reconnected', dbEvents.onReconnectedEvent)
    .on('error', dbEvents.onErrorEvent)
    .on('fullsetup', dbEvents.onFullSetupEvent)
    .on('all', dbEvents.onAllEvent)
    .on('reconnectFailed', dbEvents.onReconnectFailedEvent);
}

module.exports = {

  /**
  * Inizializza il database
  * @returns Se la connessione è andata a buon fine
  */
  initialize: async (options) => {
    const o = options || settings.mongodb.connectionOptions;

    if (!o) {
      throw new Error('No options specified');
    }

    const _opt = {
      username: o.username || 'root',
      password: o.password || 'example',
      host: o.host || 'localhost',
      port: o.port || '27017',
      database: o.database || 'AE',
    };

    if (!initialized) {
      let str = `mongodb://${_opt.username}:${_opt.password}@${_opt.host}:${_opt.port}/${_opt.database}?`;

      const _params = [
        'authSource=admin',
        'readPreference=primary',
        'appname=AirEdge',
        'directConnection=true',
        'ssl=false',
      ];

      _params.forEach((val, index) => {
        if (index > 0) {
          str += '&';
        }
        str += val;
      });

      subscribeEvents();

      await mongoose.connect(str, settings.mongodb.socketOptions);

      initialized = true;
      return true;
    }
    return false;
  },

  /**
   * @returns Ritorna la connessione corrente
   */
  getCurrentConnection: () => mongoose.connection,

  /**
  * @returns Database inizializzato
  */
  isInitialized: () => initialized,

  /**
   * Forza la disconnessione e togli inizializzato
   * @returns Se la disconnessione è andata a buon fine
   */
  forceDisconnection: async () => {
    if (initialized) {
      unsubscribeEvents();

      await mongoose.disconnect();
      initialized = false;
      return true;
    }
    return false;
  },

  /**
   * Scrivi la configurazione
   */
  writeConfiguration: async (config, options) => {
    const count = await configModel.countDocuments();
    switch (count) {
      case 0:
        return configModel.create(config, options);
      case 1:
        return configModel.updateOne({}, config, options);
      default:
        return configModel.remove({}).then(() => configModel.create(config, options));
    }
  },

  /**
   * Leggi la configurazione
   */
  readConfiguration: (projection, options) => configModel.findOne({}, projection, options),

  /**
   * Esegui un log
   */
  writeLog: (log, options) => logModel.create(log, options),

  /**
   * Leggi i logs
   */
  readLogs: (filter, projection, options) => logModel.find(filter, projection, options),

  /**
   * Elimina dei logs
   */
  clearLogs: (filter) => logModel.remove(filter),

  /**
   * Aggiorna dei logs
   */
  updateLogs: (filter, update, options) => logModel.updateMany(filter, update, options),

  /**
   * Scrivi gli allarmi
   */
  writeAlarm: (alarm, options) => mongoose.model(utils.buildAlarmDbName(alarm.device), alarmSchema).create(alarm, options),

  /**
   * Leggi i logs
   */
  readAlarms: (device, filter, projection, options) => mongoose.model(utils.buildAlarmDbName(device), alarmSchema).find(filter, projection, options),

  /**
   * Elimina dei logs
   */
  clearAlarms: (device, filter) => mongoose.model(utils.buildAlarmDbName(device), alarmSchema).remove(filter),

  /**
   * Aggiorna degli allarmi
   */
  updateAlarms: (device, filter, update, options) => mongoose.model(utils.buildAlarmDbName(device), alarmSchema).updateMany(filter, update, options),

  /**
   * Scrivi una scadenza
   */
  writeSchedule: (schedule, options) => scheduleModel.create(schedule, options),

  /**
   * Scrivi una scadenza
   */
  readSchedules: (filter, projection, options) => scheduleModel.find(filter, projection, options),

  /**
   * Scrivi una scadenza
   */
  clearSchedules: (filter) => scheduleModel.remove(filter),

  /**
   * Aggiorna delle scadenze
   */
  updateSchedules: (filter, update, options) => scheduleModel.updateMany(filter, update, options),
};
