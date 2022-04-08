module.exports = {

  mongodb: {

    /**
     * Opzioni di connessione
     */
    /*
    connectionOptions: {
      username: '',
      password: '',
      host: '',
      port: '',
      database: '',
    },
    */

    /**
     * Opzioni Socket
     */
    socketOptions: {
      serverSelectionTimeoutMS: 30000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      heartbeatFrequencyMS: 15000,
    },

    /**
     *  Opzioni Schemi
     */
    schemaOptions: {
      schedules: {
        repeat_after: {
          default: 7,
        },
      },
    },

    /**
     * Nomi delle collezioni
     */
    collectionNames: {
      configs: 'configs',
      logs: 'logs',
      schedules: 'schedules',
      alarms: {
        default_name: 'unknown_device',
        suffix: 'alarms',
      },
    },

    /**
    * Dimensione massima delle collezioni in MEGABYTES
    */
    cappedSizes: {
      logs: 60,
      alarms: 5,
    },
  },

};
