var addSongToQueue = require("./addSongToQueue");
var getAllQueued = require("./getAllQueued");
var voteSong = require("./voteSong");
var playNext = require("./playNext");
var getAudioFile = require("./getAudioFile");
var saveAudioVisualisation = require("./saveAudioVisualisation");
var getAudioVisualisation = require("./getAudioVisualisation");

module.exports = {
  addSongToQueue: addSongToQueue,
  getAllQueued: getAllQueued,
  voteSong: voteSong,
  playNext: playNext,
  getAudioFile: getAudioFile,
  saveAudioVisualisation: saveAudioVisualisation,
  getAudioVisualisation: getAudioVisualisation
};
