// Packages
var _ = require("lodash");

// Vars
this.io;

var set = module.exports.set = (type) => {

    switch (type) {

      case "CONNECTED":
        return "CONNECTED";
        break;

      case "DOWNLOAD_PROGRESS":
        //console.log('[IO Emitter:16] DOWNLOAD_PROGRESS');
        return "DOWNLOAD_PROGRESS";
        break;

      case "DOWNLOAD_DONE":
        return "DOWNLOAD_DONE";
        break;

      case "UPDATED_SOCKET_ID":
        return "UPDATED_SOCKET_ID";
        break;

      case "QUEUE_UPDATED":
        return "QUEUE_UPDATED";
        break;

      case "PROFILE_UPDATED":
        return "PROFILE_UPDATED";
        break;

      case "CHECK_SPEAKER_QUEUE":
        return "CHECK_SPEAKER_QUEUE";
        break;

      case "SPEAKER_RESET":
        return "SPEAKER_RESET";
        break;

      case "SPEAKER_UNSET":
        return "SPEAKER_UNSET";
        break;

      case "SPEAKER_POS_UPDATED":
        return "SPEAKER_POS_UPDATED";
        break;

      default:
        return "default";
        break;

    }

};

var sendAll = (socketIds, type, data) => {

  _.forEach(socketIds, (socketId) => {
    this.io.to(socketId).emit(set(type), data);
  });

};

module.exports.sendAll = sendAll;

module.exports.emit = (type, tokens, data) => {

  if(typeof(data) === 'undefined') data = {};

  if(tokens.length > 0){
    sendAll(tokens, type, data);
  }

};

module.exports.broadcast = (type, data) => {

  if(typeof(data) === 'undefined') data = {};

  console.log('[EmitHelper]', type);
  this.io.sockets.emit(set(type), data);

}

// Init io in the listener
module.exports.init = (_io) => {

  this.io = _io;

};
