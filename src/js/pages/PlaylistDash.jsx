import React, {Component, PropTypes} from 'react';
import {Notifications, Profile, LoginModal, SearchModal, SuggestionDetail, DownloadProgress, PlaylistQueue, AudioPlayer, VideoPlayer} from '../components';
import UserStore from '../stores/UserStore';
import SocketStore from '../stores/SocketStore';
import * as UserActions from '../actions/UserActions';
import * as NotifActions from '../actions/NotifActions';
import users from '../api/users';
import {getBaseURL} from '../util/';

export default class PlaylistDash extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      isSpeaker: false,
      isLoggedIn: UserStore.getLoggedIn(),
      userProfile: UserStore.getProfile()
    };

    // -- Non State Vars ---
    this.waitingForSocketConnect = false;

    // -- Events ----
    this.evtUpdateUserProfile = () => this.updateUserProfile();
    this.evtSetAsSpeaker = () => this.setSpeaker(true);
    this.evtUnsetAsSpeaker = () => this.setSpeaker(false);
    this.evtCheckSocketAndSpeaker = () => this.checkSocketAndSpeaker();

  }

  componentWillMount() {
    UserStore.on(`USER_PROFILE_CHANGED`, this.evtUpdateUserProfile);
    UserStore.on(`SET_AS_SPEAKER`, this.evtSetAsSpeaker);
    UserStore.on(`UNSET_AS_SPEAKER`, this.evtUnsetAsSpeaker);
    //SocketStore.on(`SOCKET_ID_CHANGED`, this.evtCheckSocketAndSpeaker);
  }

  componentWillUnmount() {
    UserStore.removeListener(`USER_PROFILE_CHANGED`, this.evtUpdateUserProfile);
    UserStore.removeListener(`SET_AS_SPEAKER`, this.evtSetAsSpeaker);
    UserStore.removeListener(`UNSET_AS_SPEAKER`, this.evtUnsetAsSpeaker);
    //SocketStore.removeListener(`SOCKET_ID_CHANGED`, this.evtCheckSocketAndSpeaker);
  }

  componentDidMount() {

    if (this.props.status && this.props.status === `isSpeaker`) {

      console.log(`[PlaylistDash] Waiting for socket connect...`);
      //this.waitingForSocketConnect = true;
      this.checkSocketAndSpeaker();

    } else if (this.props.status && this.props.status === `loginFailed`) {
      NotifActions.addError(`Not a District01 Google+ account`);
    } else {
      UserActions.fetchProfile();
    }

  }

  setSpeaker(blnIsSpeaker) {

    let {isSpeaker} = this.state;

    isSpeaker = blnIsSpeaker;

    if (!isSpeaker) {
      NotifActions.addError(`Removed as speaker`);
      setTimeout(() => { window.location = getBaseURL(); }, 4000);
    }

    this.setState({isSpeaker});

  }

  updateUserProfile() {

    let {isLoggedIn, userProfile} = this.state;

    isLoggedIn = UserStore.getLoggedIn();
    userProfile = UserStore.getProfile();

    this.setState({isLoggedIn, userProfile});

    if (isLoggedIn) {
      if (this.props.status && this.props.status === `loginSuccess`) {
        //NotifActions.addSuccess(`Welcome back, ${userProfile.general.firstName}`);
      }
    } else {
      NotifActions.addNotification(`Till next time!`);
    }

  }

  checkSocketAndSpeaker() {

    const socketId = SocketStore.getSocketId();

    if (socketId !== ``) {

      const socketId = SocketStore.getSocketId();
      console.log(`--- [PlaylistDash] Socket Id:`, socketId, `---`);

      users.setSpeaker(true, socketId)
        .then(res => {

          // Success!
          console.log(`[SPEAKER] SET AS SPEAKER!`, res);
          UserActions.setSpeaker(true);
          NotifActions.addSuccess(`Connected as speaker`);

        }, failData => {

          // Failed!
          console.log(`[SPEAKER] COULD NOT SET AS SPEAKER!`, failData);
          NotifActions.addError(failData.error);

          setTimeout(() => { window.location = getBaseURL(); }, 4000);

        })
      ;

    } else {

      setTimeout(() => this.checkSocketAndSpeaker(), 100);

    }

  }

  render() {

    const {isSpeaker} = this.state;

    let dashboardClasses = `dashboard-wrapper`;
    if (isSpeaker) {
      dashboardClasses = `dashboard-wrapper is-speaker`;
    }

    return (
      <div className={dashboardClasses}>
        <DownloadProgress />
        <div className='logo'>&nbsp;</div>
        <Profile />
        <LoginModal />
        <SearchModal />
        <SuggestionDetail />
        <PlaylistQueue />
        <Notifications />
        <AudioPlayer />
        <VideoPlayer />
      </div>
    );

  }

}

PlaylistDash.propTypes = {
  status: PropTypes.string
};
