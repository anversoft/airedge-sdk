const { Schema } = require('mongoose');
const moment = require('moment');
const { mongodb } = require('../settings');
const { convertMegabyteToBytes } = require('../utils');

module.exports = new Schema({
  timestamp: {
    type: Date,
    default: () => moment.utc(),
  },
  alarm: String,
  status: Boolean,
  current_config: {},
  device: String,
  data: {},
}, {
  capped: convertMegabyteToBytes(mongodb.cappedSizes.alarms),
  timeseries: {
    timeField: 'timestamp',
    metaField: 'device',
    granularity: 'minutes',
  },
});
