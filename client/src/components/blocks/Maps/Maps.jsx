import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
  return (
    <MapContainer center={[19.076, 72.8777]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[19.076, 72.8777]}>
        <Popup>We are here! 🚀</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;
