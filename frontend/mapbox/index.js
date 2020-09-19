import React, { Component } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import config from '../../config';
import MapboxGL from '@react-native-mapbox-gl/maps';
import userMarker from '../assets/img/user_marker.png';
import Geolocation from 'react-native-geolocation-service';
import {bindMethods} from '../component-ops';
import FAB from '../components/fab'

const {MapView, Camera} = MapboxGL;

MapboxGL.setAccessToken(config.MAPBOX_ACCESS_TOKEN);

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  landscape: {
    height: '100%'
  },
  map: {
    height: '100%',
    width: '100%',
  },
  safeArea: {
    position: 'absolute',
    width: '100%',
    bottom: StaticSafeAreaInsets.safeAreaInsetsBottom,
    top: StaticSafeAreaInsets.safeAreaInsetsTop,
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
  }
});

export default class Map extends Component {
  constructor() {
    super();

    bindMethods(['goToCurrentLocation', 'onRegionDidChange', 'updateLocation', 'goToCurrentLocationNonFirstHelper', 'goToCurrentLocationFirstHelper', 'onDidFinishRenderingFrameFully'], this);
    this.state = {
      userLocation: null,
      zoomLevel: null,
      isMapLoading: false, // axiom: loading only applies to an existing map
      followUser: false,
      haveLocationPermission: false,
      goingToCurrentLocation: false
    };

    this.camera = React.createRef();
    
    this.defaultZoomLevel = 14;
  }
  
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }

  cameraHasMoved = (coords, otherCoords) => {
    const threshold = 1 * Math.pow(10, -14);
    return Math.abs(coords.latitude - otherCoords.latitude > threshold) || Math.abs(coords.longitude - otherCoords.longitude > threshold);
  }

  onDidFinishRenderingFrameFully() {
    if (this.state.goingToCurrentLocation) {
      this.setState({
        goingToCurrentLocation: false,
        followUser: true
      });
    }
  }
  
  onRegionDidChange(event) {
    const [cameraLongitude, cameraLatitude] = event.geometry.coordinates;
    let followUser = this.state.followUser;
    if (followUser && this.cameraHasMoved({longitude: cameraLongitude,latitude: cameraLatitude}, this.state.userLocation)) {
      followUser = false;
    }
    this.setState({
      followUser
    });
  }

  goToCurrentLocation() {
    this.state.haveLocationPermission ?
      this.goToCurrentLocationNonFirstHelper() :
      this.goToCurrentLocationFirstHelper() // assumption: only on first time is currentLocation in state null
  }

  goToCurrentLocationNonFirstHelper() {
    this.setState({
      goingToCurrentLocation: true,
      followUser: false,
      cameraCoordinates: [this.state.userLocation.longitude, this.state.userLocation.latitude],
      zoomLevel: this.defaultZoomLevel
    }, () => {
      this.camera.current.setCamera({
        centerCoordinate: this.state.cameraCoordinates,
        zoomLevel: this.state.zoomLevel
      });
    })
  }

  goToCurrentLocationFirstHelper() {
    const doUpdates = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          this.setState({
            haveLocationPermission: true,
            goingToCurrentLocation: true,
            cameraCoordinates: [longitude, latitude],
            zoomLevel: this.defaultZoomLevel
          });
        },
        error => {
          console.log(error.code, error.message); // incorporate actual error-handling mechanism in the future (e.g., Rollbar)
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
      );
    };
    if (isAndroid) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Request',
          'message': 'Tinytown needs access to your location'
        }
      )
      .then(status => {
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          doUpdates();
        }
      });
      return null;
    }

    // assume iOS
    Geolocation.requestAuthorization('always')
      .then(status => {
        if (status === 'granted') {
          doUpdates();
        }
      });
  }

  updateLocation(event) {
    if (!event) {
      return;
    }
    const {latitude, longitude} = event.coords;
    this.setState({
      userLocation: {
        longitude,
        latitude
      }
    });
  }

  render() {
    /* 
      the landscape view here is due to me not knowing a better alternative to ensure map takes full page size.
      also, tried adding this as a proper jsx comment next to the respective view, but to no avail.
    */
    const {zoomLevel, followUser, haveLocationPermission, goingToCurrentLocation, cameraCoordinates} = this.state;
    return (
      <View style={styles.landscape}>
            <MapView
                animated={true}
                style={styles.map}
                styleURL={'mapbox://styles/alfalcon/cka1xbje712931ipd6i5uxam8'}
                logoEnabled={false}
                attributionEnabled={false}
                onRegionDidChange={this.handleRegionChange}
                regionDidChangeDebounceTime={2000}
                onDidFinishRenderingFrameFully={this.onDidFinishRenderingFrameFully}
            >
              {haveLocationPermission ? <MapboxGL.UserLocation
                visible={haveLocationPermission}
                animate={haveLocationPermission}
                onUpdate={this.updateLocation}
              >
                <MapboxGL.SymbolLayer
                  id={'customUserLocationIcon'}
                  style={{
                    iconAllowOverlap: true,
                    iconImage: userMarker,
                    iconSize: 0.25
                  }}
                  minZoomLevel={1}
                />
              </MapboxGL.UserLocation> : null}
              <Camera
                followUserLocation={followUser}
                followUserMode={MapboxGL.UserTrackingModes.FollowWithHeading}
                ref={this.camera}
                centerCoordinate={cameraCoordinates ? cameraCoordinates : undefined}
                zoomLevel={zoomLevel ? zoomLevel : undefined}
                animationDuration={2000}
                >
              </Camera>
            </MapView>
            <View style={styles.safeArea} pointerEvents='box-none'>
              <View style={styles.fabContainer}>
                <FAB label='Go to my location' theme='green' icon='crosshairs' onPress={this.goToCurrentLocation} disabled={goingToCurrentLocation}/>
              </View>
            </View>
      </View>
    );
  }
}
