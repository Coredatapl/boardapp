import {
  GoogleMap,
  TrafficLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useGlobalState } from '../../utils/useGlobalState';
import { useGeolocation } from '../../utils/useGeolocation';

export default function MapWidget() {
  const { globalState } = useGlobalState();
  const { lat, lon } = useGeolocation();

  if (!globalState.widgetMapActive || globalState.mobile) {
    return <></>;
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY as string,
  });
  const zoom = 14;
  const containerStyle = {
    width: '300px',
    height: '400px',
    borderRadius: '0.5rem',
    boxShadow: 'rgba(0, 0, 0, 0)',
    bocSizing: 'border-box',
  };
  const options = {
    backgroundColor: 'rgb(1, 6, 13)',
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
      },
    ],
  };

  return (
    <div className="absolute left-0 text-left">
      <div className="container">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={options}
            center={{ lat, lng: lon }}
            zoom={zoom}
          >
            <TrafficLayer />
          </GoogleMap>
        ) : (
          <div>Loading map ...</div>
        )}
      </div>
    </div>
  );
}
