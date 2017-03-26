import io from 'socket.io-client';
import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import UserStore from './UserStore';
import PlaylistStore from '../stores/PlaylistStore';

class SocketStore extends EventEmitter {

  constructor() {

    super();

    this.socket = io();
    this.socketId = ``;

    // -- Vars ---------
    this.appearBusy = false;
    this.downloadProgress = 0;

    // -- Events -------
    this.socket.on(`CONNECTED`, socketId => this.setSocketId(socketId));
    this.socket.on(`UPDATED_SOCKET_ID`, socketId => UserStore.updateSessionSocketId(socketId));
    this.socket.on(`DOWNLOAD_PROGRESS`, data => this.updateDownloadProgress(data));
    this.socket.on(`DOWNLOAD_DONE`, data => this.updateDownloadProgress(data));
    this.socket.on(`QUEUE_UPDATED`, () => this.emit(`QUEUE_UPDATED`));
    this.socket.on(`PROFILE_UPDATED`, user => UserStore.updateUserProfile(user));
    this.socket.on(`SPEAKER_RESET`, () => PlaylistStore.updateSpeakerConnected(true));
    this.socket.on(`SPEAKER_UNSET`, () => PlaylistStore.updateSpeakerConnected(false));
    this.socket.on(`SPEAKER_POS_UPDATED`, speakerPos => PlaylistStore.synchPosToSpeaker(speakerPos));

  }

  updateDownloadProgress(downloadData) {

    if (this.appearBusy === true) {
      this.appearBusy = false;
      this.emit(`APPEAR_BUSY_CHANGED`);
    }

    this.downloadProgress = downloadData.percent;
    this.emit(`DOWNLOAD_PROGRESS_UPDATED`);

  }

  setSocketId(socketId) {

    //console.log(`[SocketStore] Connected to socket:`, socketId);

    this.socketId = socketId;

  }

  setAppearBusy(busy) {

    if (this.downloadProgress === 0 || this.downloadProgress === 1) {
      this.appearBusy = busy;
      this.emit(`APPEAR_BUSY_CHANGED`);
    }

  }

  emitSpeakerPos(speakerPos) {

    this.socket.emit(`UPDATE_SPEAKER_POS`, speakerPos);

  }

  getDownloadProgress() {

    return this.downloadProgress;

  }

  getSocket() {

    return this.socket;

  }

  getSocketId() {

    return this.socketId;

  }

  getAppearBusy() {

    return this.appearBusy;

  }

  handleActions(action) {

    switch (action.type) {

    case `RESET_DOWNLOAD_PROGRESS`:
      this.resetDownloadProgress();
      break;

    case `SET_APPEAR_BUSY`:
      this.setAppearBusy(action.data);
      break;

    }

  }

}

const socketStore = new SocketStore;
dispatcher.register(socketStore.handleActions.bind(socketStore));
window.dispatcher = dispatcher;

export default socketStore;
