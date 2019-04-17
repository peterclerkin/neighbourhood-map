import React, { Component } from 'react';
import './App.css';
import { GoogleApiWrapper } from 'google-maps-react';
import MapContainer from './MapContainer';

//Handling for when the Google API has a problem on request!
document.addEventListener("DOMContentLoaded", function(e) {
  let scriptTag = document.getElementsByTagName('SCRIPT').item(1);
  scriptTag.onerror = function(e) {
    console.log('Sorry! We cant access Google Maps API for now!')
    let mapContainerElemt = document.querySelector('#root');
    let erroElement = document.createElement('div');
    erroElement.innerHTML = '<div class="error-msg">Sorry! We cant access Google Maps API for now! </div>'
    mapContainerElemt.appendChild(erroElement)
  }
})

class App extends Component {

  componentDidMount() {
    document.querySelector('.menu-icon').addEventListener('click', this.toggleSideBar)
    
  }

  toggleSideBar = () => {
    document.querySelector('.sidebar').classList.toggle('sidebar-hide')
  }

  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="menu-icon">
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
          <h1 className="App-title">Neighbourhood User Map</h1>
        </header>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC7vgVATg6_LqIfmx61Y6RT-AaBY11TefA'
})(App)
