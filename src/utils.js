/* eslint-disable max-len */

const moment = require('moment');
const uuid = require('uuid');
const settings = require('./settings');

/**
 * Converte i Megabytes in Bytes
 * @param {Number} bytes Bytes
 */
function convertMegabyteToBytes(bytes) {
  return bytes * 1024 * 1024;
}

/**
 * @returns Nome del databse mongo del dispositivo specificato
 */
function buildAlarmDbName(device) {
  return (`${device || settings.mongodb.collectionNames.alarms.default_name}.${settings.mongodb.collectionNames.alarms.suffix}`).replace(' ', '');
}

function getDateMidnight() {
  return moment()
    .utc()
    .milliseconds(0)
    .seconds(0)
    .minutes(0)
    .hours(0);
}

function generateUuid() {
  return uuid.v4();
}

module.exports = {
  convertMegabyteToBytes,
  buildAlarmDbName,
  getDateMidnight,
  generateUuid,
};
