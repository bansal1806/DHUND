import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ center, markers = [], searchRadius = 0 }) => {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h3 className="font-bold text-gray-900">{marker.title}</h3>
                                <p className="text-sm text-gray-700">{marker.description}</p>
                                {marker.isMatch && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                        Match Found
                                    </span>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {searchRadius > 0 && (
                    <Circle
                        center={center}
                        radius={searchRadius}
                        pathOptions={{
                            color: '#8b5cf6',
                            fillColor: '#8b5cf6',
                            fillOpacity: 0.1
                        }}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
