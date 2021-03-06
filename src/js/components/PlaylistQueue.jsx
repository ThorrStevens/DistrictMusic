import React, {Component} from 'react';
import {SongSummary} from '../components';
import PlaylistStore from '../stores/PlaylistStore';
import UserStore from '../stores/UserStore';
import * as PlaylistActions from '../actions/PlaylistActions';

export default class PlaylistQueue extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      currentQueue: PlaylistStore.getCurrentQueue(),
      voteMode: UserStore.getVoteMode()
    };

    // -- Non state vars ----
    this.hasFetchedQueue = false;

    // -- Events ----
    this.evtPlaylistActionUpdateQueue = () => PlaylistActions.updateQueue();
    this.evtUpdateQueue = () => this.updateQueue();
    this.evtUpdateVoteMode = () => this.updateVoteMode();

  }

  componentWillMount() {

    // listeners
    UserStore.on(`USER_PROFILE_CHANGED`, this.evtPlaylistActionUpdateQueue);
    PlaylistStore.on(`QUEUE_CHANGED`, this.evtUpdateQueue);
    UserStore.on(`VOTE_MODE_CHANGED`, this.evtUpdateVoteMode);

    // fetch queue from api
    PlaylistActions.updateQueue();

  }

  componentWillUnmount() {

    UserStore.removeListener(`USER_PROFILE_CHANGED`, this.evtPlaylistActionUpdateQueue);
    PlaylistStore.removeListener(`QUEUE_CHANGED`, this.evtUpdateQueue);
    UserStore.removeListener(`VOTE_MODE_CHANGED`, this.evtUpdateVoteMode);

  }

  componentDidMount() {

  }

  updateQueue() {

    let {currentQueue} = this.state;

    currentQueue = PlaylistStore.getCurrentQueue();

    this.hasFetchedQueue = true;

    this.setState({currentQueue});

  }

  updateVoteMode() {

    let {voteMode} = this.state;

    voteMode = UserStore.getVoteMode();

    this.setState({voteMode});

  }

  renderCurrentQueue(currentQueue) {

    if (currentQueue.length > 0) {

      const {voteMode} = this.state;

      const isLoggedIn = UserStore.getLoggedIn();

      let i = 0;
      return currentQueue.map(song => {

        i ++;

        if (!isLoggedIn) {
          song.uservote = {hasVoted: false};
        } else if (!song.uservote) {
          song.uservote = {hasVoted: false};
        }

        const fsPreview = false;
        const disableButtons = false;
        const key = `${song.general.id}`;

        return <SongSummary {...song} order={i} key={key} fsPreview={fsPreview} voteMode={voteMode} disableButtons={disableButtons} />;

      });

    }

  }

  render() {

    const {currentQueue} = this.state;

    return (
      <article className='playlist-queue'>
        <section className='playlist-header'>
          <h2 className='active'>In Queue</h2>
        </section>
        <section className='current-queue'>
          {this.renderCurrentQueue(currentQueue)}
        </section>
      </article>
    );

  }

}

// <h2>Alltime best</h2>
