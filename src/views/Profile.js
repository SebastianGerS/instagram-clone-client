import React, {Component} from 'react';
import {ItemGrid, ItemFeed} from '../containers';
import { UserProfile, Tab } from '../components';
import {connect} from 'react-redux';
import {fetchMediaItems, fetchUserMediaItems, fetchUser} from '../actions';
import { Redirect } from 'react-router-dom';
import './Profile.css';

const mapStateToProps = state => {
  return { mediaItems: state.mediaItems, token: state.token, isLogedin: state.isLogedin};
}

class ConnectedProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      tabs: { 0: 'active'},
    }

    this.changeTab = this.changeTab.bind(this);
  }

  componentWillMount() {
    if (this.props.location.pathname === '/profile') {
      this.props.dispatch(fetchMediaItems(this.props.token.value)); 
    } else {
      this.props.dispatch(fetchUser(this.props.match.params.userId)); 
      this.props.dispatch(fetchUserMediaItems(this.props.match.params.userId)); 
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.location.pathname !== this.props.location.pathname){
      if (this.props.location.pathname === '/profile') {
        this.props.dispatch(fetchMediaItems(this.props.token.value)); 
      } else {
        this.props.dispatch(fetchUser(this.props.match.params.userId)); 
        this.props.dispatch(fetchUserMediaItems(this.props.match.params.userId)); 
      }
    }   
  }

  changeTab(index) {
    return this.setState({
      activeTab: index,
      tabs: {
        [`${index}`]: 'active'
      }
    });
  }

  render() {
    let content;
    if(!this.props.isLogedin && this.props.location.pathname === '/profile') {
      return <Redirect to='/'/>;
    }

    if (this.state.activeTab === 0) {
      content = <ItemGrid path={this.props.location.pathname} mediaItems={this.props.mediaItems}/>;
    } else if(this.state.activeTab === 1) {
      content = <ItemFeed path={this.props.location.pathname} mediaItems={this.props.mediaItems}/>;
    }
    
    return (
      <div className="content">
        <UserProfile path={this.props.location.pathname}/>
        <div className="tabs">
          <Tab index={0} name="Grid" changeTab={this.changeTab} active={this.state.tabs[0]}/>
          <Tab index={1} name="Flow" changeTab={this.changeTab} active={this.state.tabs[1]}/>
        </div>
        {content}
      </div>
    );
   }
}

const Profile = connect(mapStateToProps)(ConnectedProfile);

export default Profile;