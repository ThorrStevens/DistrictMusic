import React, {Component} from 'react';
import UserStore from '../stores/UserStore';
import * as UserActions from '../actions/UserActions';
import * as NotifActions from '../actions/NotifActions';

export default class Profile extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      isLoggedIn: UserStore.getLoggedIn(),
      isSynched: UserStore.getSynched(),
      voteMode: UserStore.getVoteMode(),
      prevVoteMode: `normal`,
      userProfile: UserStore.getProfile(),
      showProfileOptions: false
    };

    // -- Non state vars ----
    this.hasChangedVoteMode = false;

    // -- Events ----
    this.evtUpdateUserProfile = () => this.updateUserProfile();
    this.evtUpdateVoteMode = () => this.updateVoteMode();
    this.evtUpdateSynched = () => this.updateSynched();

  }

  componentWillMount() {
    UserStore.on(`USER_PROFILE_CHANGED`, this.evtUpdateUserProfile);
    UserStore.on(`VOTE_MODE_CHANGED`, this.evtUpdateVoteMode);
    UserStore.on(`SYNCHED_CHANGED`, this.evtUpdateSynched);
  }

  componentWillUnmount() {
    UserStore.removeListener(`USER_PROFILE_CHANGED`, this.evtUpdateUserProfile);
    UserStore.removeListener(`VOTE_MODE_CHANGED`, this.evtUpdateVoteMode);
    UserStore.removeListener(`SYNCHED_CHANGED`, this.evtUpdateSynched);
  }

  componentDidMount() {

  }

  hideProfileOptions() {

    const {isLoggedIn} = this.state;
    let {showProfileOptions} = this.state;

    if (isLoggedIn && showProfileOptions) {
      showProfileOptions = false;
      this.setState({showProfileOptions});
    }

  }

  updateVoteMode() {

    let {voteMode, prevVoteMode} = this.state;

    prevVoteMode = voteMode;
    voteMode = UserStore.getVoteMode();

    this.hasChangedVoteMode = true;

    this.setState({voteMode, prevVoteMode});

  }

  updateUserProfile() {

    let {isLoggedIn, userProfile} = this.state;

    isLoggedIn = UserStore.getLoggedIn();
    userProfile = UserStore.getProfile();

    this.setState({isLoggedIn, userProfile});

  }

  updateSynched() {

    let {isSynched} = this.state;

    isSynched = UserStore.getSynched();

    this.setState({isSynched});

  }

  checkProfileActions() {

    const {isLoggedIn} = this.state;


    let {showProfileOptions} = this.state;

    if (isLoggedIn) {
      showProfileOptions = !showProfileOptions;
      this.setState({showProfileOptions});
    } else if (!UserStore.getIsSpeaker()) {
      console.log(`[Profile] Must login to continue...`);
      document.querySelector(`.profile`).blur();
      UserActions.showLoginModal();
    } else {
      NotifActions.addError(`Cannot login as speaker`);
    }

  }

  renderProfileOptions() {

    const {isLoggedIn, voteMode, userProfile, showProfileOptions} = this.state;

    const optionsClasses = `profile-options show`;
    if (showProfileOptions) {
      //optionsClasses = `profile-options show`;
      const $profile = document.querySelector(`.profile`);
      $profile.focus();
    }

    let vetoModeClasses = `btn-toggle-veto`;
    if (voteMode === `veto`) {
      vetoModeClasses = `btn-toggle-veto active`;
    }

    let superModeClasses = `btn-toggle-super`;
    if (voteMode === `super`) {
      superModeClasses = `btn-toggle-super active`;
    }

    if (isLoggedIn && !UserStore.getIsSpeaker()) {
      return (
        <div className={optionsClasses}>
          <ul>
            <li onClick={() => UserActions.setVoteMode(`veto`)}><div alt='Toggle Veto Mode' className={vetoModeClasses}><span>Vetos x{userProfile.permissions.vetosLeft}</span></div></li>
            <li onClick={() => UserActions.setVoteMode(`super`)}><div alt='Toggle Super Mode' className={superModeClasses}><span>Supers x{userProfile.permissions.superVotesLeft}</span></div></li>
            <li onClick={() => UserActions.logoutUser()}><div alt='Logout' className='btn-logout'><span>logout</span></div></li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className={optionsClasses}>
          <ul>
            <li onClick={() => this.checkProfileActions()}><div className='btn-login'><span>login</span></div></li>
          </ul>
        </div>
      );
    }

  }

  render() {

    const {isLoggedIn, userProfile} = this.state;
    const profileImage = userProfile.general.profileImage;
    const style = {backgroundImage: `url(${  profileImage  })`};

    if (this.hasChangedVoteMode) {

      const {voteMode, prevVoteMode} = this.state;

      if (voteMode === `veto` || voteMode === `super`) {
        setTimeout(NotifActions.addNotification(`Entered ${voteMode} mode`), 0);
      } else if (voteMode === `normal` && prevVoteMode !== `normal`) {
        setTimeout(NotifActions.addNotification(`Exited ${prevVoteMode} mode`), 0);
      }

      this.hasChangedVoteMode = false;

    }

    let profileClasses = `profile logged-out`;
    if (isLoggedIn) {
      profileClasses = `profile logged-in`;
    }

    return (
      <article className={profileClasses} tabIndex='0' onBlur={() => this.hideProfileOptions()}>
        <div className='profile-img' style={style} onClick={() => this.checkProfileActions()}>&nbsp;</div>
        { this.renderProfileOptions() }
      </article>
    );

  }

}
