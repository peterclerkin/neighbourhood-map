import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export default class MapContainer extends Component {

    //Component State
    state = {
        //Names and locations for the markers 
        venues: [],
        query: '',
        markers: [],
        users: [],
        infowindow: new this.props.google.maps.InfoWindow(),
        error: null,
        mapError: null
    };


    componentDidMount() {
        //Get 6 FourSquare (third party) API details
        const url = 'https://api.foursquare.com/v2/venues/search?client_id=NB4TPAA2Z5R310AIM1TQAIZHV20XYWONFFHG0T23BP2QFEK0&client_secret=LCFAR5MAWSRI0KYFBQATKOD10HGTFGAAGBX0KZ4RNMU4U1UD&limit=6&v=20180323&ll=54.9535897,-7.7406985';
        fetch(url)
            .then(data => {
                if (data.ok) {
                    //console.log(data.json());
                    return data.json();
                } else {
                    throw new Error(data.statusText)
                }
            })
            .then(data => {
                const venues = data.response["venues"];
                this.setState({ venues: venues });
                this.loadMap();
                this.onclickLocation()
            })
            .catch(err => {
                this.setState({ error: err.toString() })
            })
    }

    //Load map details
    loadMap() {
        if (this.props && this.props.google) {
            const { google } = this.props;
            const maps = google.maps;
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
            let lat = 54.9535897;
            let lng = -7.7406985;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
                center: center,
                zoom: 10,
                mapTypeId: 'roadmap'
            });

            this.map = new maps.Map(node, mapConfig);
            this.addMarkers()
        } 
    }

    //Menu onclick to show marker info window
    onclickLocation = () => {
        const that = this;
        const { infowindow } = this.state;

        const displayInfowindow = (e) => {
            const { markers } = this.state;
            const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase());
            that.populateInfoWindow(markers[markerInd], infowindow, that.state.users[markerInd])

        };
        document.querySelector('.location-list').addEventListener('click', function (e) {
            if (e.target && e.target.nodeName === "LI") {
                displayInfowindow(e)
            }
        })
    };

    //Add markers on the map
    addMarkers = () => {
        const { users } = this.state;
        const { google } = this.props;
        let { infowindow } = this.state;
        const bounds = new google.maps.LatLngBounds();

        this.state.venues.forEach((venue, ind) => {
            const marker = new google.maps.Marker({
                position: { lat: venue.location.lat, lng: venue.location.lng },
                map: this.map,
                title: venue.name
            });
            marker.addListener('click', () => {
                this.populateInfoWindow(marker, infowindow, users[ind])
            });
            this.setState((state) => ({
                markers: [...state.markers, marker]
            }));
            bounds.extend(marker.position)
        });
        this.map.fitBounds(bounds)
    };

    //Populate infowindows with content
    populateInfoWindow = (marker, infowindow, user) => {
        const { google } = this.props;
        const service = new google.maps.places.PlacesService(this.map);
        const geocoder = new google.maps.Geocoder();

        if (infowindow.marker !== marker) {
            //Bounce animation for the marker
            infowindow.marker = marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1000);
            //Content for infowindows
            geocoder.geocode({ 'location': marker.position }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        service.getDetails({
                            placeId: results[1].place_id
                        }, (place, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                infowindow.setContent(`<h4>Name: <strong>${marker.title}</strong></h4>
                             <div>Latitude: ${marker.getPosition().lat()}</div>
                             <div>Longitude: ${marker.getPosition().lng()}</div>`);
                                infowindow.open(this.map, marker);
                            }
                        });
                        //Alert if no results are found 
                    } else {
                        window.alert('No results found');
                    }
                    //Alert if the geocoder fails
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
            //Close click for the infowindow
            infowindow.addListener('closeclick', () => {
                infowindow.marker = null
            });
        }
    };
    //Update state so input box shows current query value
    handleValueChange = (e) => {
        this.setState({ query: e.target.value })
    };

    render() {
        //Show & hide markers based on the search input
        const {markers, venues, query, infowindow} = this.state;
        if (query) {
            venues.forEach((l, i) => {
                if (l.name.toLowerCase().includes(query.toLowerCase())) {
                    markers[i].setVisible(true)
                } else {
                    if (infowindow.marker === markers[i]) {
                        infowindow.close()
                    }
                    markers[i].setVisible(false)
                }
            })
        } else {
            venues.forEach((l, i) => {
                if (markers.length && markers[i]) {
                    markers[i].setVisible(true)
                }
            })
        }
        
        
        //Content showing the map & sidebar
        return (
            
            <div>
                {this.state.error ? (
                        <div className="error">
                            An error has occurred; please try again later
                            <div className="error-description">{this.state.error}</div>
                        </div>) :
                    (<div className="container">
                        <nav className="sidebar sidebar-hide">
                            <div className="search-bar">
                                <input role="search" type="text" placeholder="Filter.." aria-labelledby="search-bar"
                                       value={this.state.value} onChange={this.handleValueChange}/>
                            </div>
                            <ul className="location-list">{
                                markers.filter(m => m.getVisible()).map((m, i) =>
                                    (<li role="link" key={i} tabIndex="0">{m.title}</li>))
                            }
                            </ul>
                        </nav>
                        <div role="application" className="map" ref="map">
                            Loading map...
                            {this.state.Error || <div className="error">{this.gm_authFailure()}</div>}
                        </div>
                    </div>)}
            </div>
        )
    }
    gm_authFailure() {
        return (
            <div>Please refresh the page and try again!</div>
        );
    }
}

