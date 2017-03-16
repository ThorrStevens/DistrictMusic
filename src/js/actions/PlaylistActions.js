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
