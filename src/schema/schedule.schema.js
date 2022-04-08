const { Schema } = require('mongoose');
const { mongodb } = require('../settings');
const { getDateMidnight, generateUuid } = require('../utils');

module.exports = new Schema({
  _id: {
    type: String,
    default: () => generateUuid(),
  },
  name: String,
  enabled: {
    type: Boolean,
    default: true,
  },
  emails: [{
    email: String,
    checked: Boolean,
  }],
  call_at: {
    type: Date,
    default: () => getDateMidnight().add(mongodb.schemaOptions.schedules.repeat_after.default, 'days'),
  },
  repeat_after: {
    type: Number,
    default: mongodb.schemaOptions.schedules.repeat_after.default,
  },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
