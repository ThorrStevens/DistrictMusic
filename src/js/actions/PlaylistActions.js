import dispatcher from '../dispatcher';

export function showSearchModal() {
  dispatcher.dispatch({
    type: `SHOW_SEARCH_MODAL`
  });
}

export function hideSearchModal() {
  dispatcher.dispatch({
    type: `HIDE_SEARCH_MODAL`
  });
}

export function showSuggestionDetail(data) {
  dispatcher.dispatch({
    type: `SHOW_SUGGESTION_DETAIL`,
    data: data
  });
}

export function hideSuggestionDetail() {
  dispatcher.dispatch({
    type: `HIDE_SUGGESTION_DETAIL`
  });
}

export function resetSearchbar() {
  dispatcher.dispatch({
    type: `RESET_SEARCH_BAR`
  });
}

export function updateQueue() {
  dispatcher.dispatch({
    type: `UPDATE_QUEUE`
  });
}

export function setSong(song) {
  dispatcher.dispatch({
    type: `SET_USER_CHOSEN_SONG`,
    data: song
  });
}

export function setAudioPos(audioPos, sendSocketEvent) {
  dispatcher.dispatch({
    type: `SET_AUDIO_POS`,
    audioPos: audioPos,
    sendSocketEvent: sendSocketEvent
  });
}

export function setVideoPos(videoPos) {
  dispatcher.dispatch({
    type: `SET_VIDEO_POS`,
    data: videoPos
  });
}
