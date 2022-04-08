const { Schema } = require('mongoose');
const moment = require('moment');
const { mongodb } = require('../settings');
const { convertMegabyteToBytes } = require('../utils');

module.exports = new Schema({
  timestamp: {
    type: Date,
    default: () => moment.utc(),
  },
  metadata: {},
  data: {
    type: {},
    alias: 'Data',
  },
},
{
  capped: convertMegabyteToBytes(mongodb.cappedSizes.logs),
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'minutes',
  },
});
