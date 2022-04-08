const { Schema } = require('mongoose');

module.exports = new Schema({
  uuid: {
    type: String,
    alias: 'Id',
  },
  name: {
    type: String,
    alias: 'Name',
  },
  type: {
    type: String,
    alias: 'Type',
  },
  version: {
    type: String,
    alias: 'Version',
  },
  emails: {
    type: {},
    alias: 'EmailSend',
  },
  devices: {
    type: {},
    alias: 'Devices',
  },
  version_features: {
    type: Object,
    alias: 'VersionFeatures',
    MongoDBConversion: {
      type: Boolean,
      default: true,
    },
    ErrorGlobalTopic: {
      type: Boolean,
      default: true,
    },
    ElgiN3Support: {
      type: Boolean,
      default: true,
    },
    ReadWriteCustomFiles: {
      type: Boolean,
      default: true,
    },
    SchedulerReturnEmpty: {
      type: Boolean,
      default: true,
    },
  },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
