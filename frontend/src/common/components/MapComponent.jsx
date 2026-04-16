import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const MapClickHandler = ({ onClick }) => {
    useMapEvents({
        click: (e) => {
            if (onClick) {
                onClick(e.latlng);
            }
        },
    });
    return null;
};

// Component to handle marker drag
const DraggableMarker = ({ position, onDragEnd }) => {
    const markerRef = React.useRef(null);

    const eventHandlers = React.useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    onDragEnd(newPos);
                }
            },
        }),
        [onDragEnd],
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
};

const MapComponent = ({
    center = [20.5937, 78.9629], // Default center (India)
    zoom = 5,
    height = '400px',
    marker = null,
    draggable = false,
    onClick = null,
    onMarkerDragEnd = null,
    showControls = true,
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height, width: '100%', borderRadius: '16px', zIndex: 0 }}
            scrollWheelZoom={true}
            zoomControl={showControls}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Handle map clicks */}
            {onClick && <MapClickHandler onClick={onClick} />}

            {/* Display marker */}
            {marker && (
                draggable && onMarkerDragEnd ? (
                    <DraggableMarker position={marker} onDragEnd={onMarkerDragEnd} />
                ) : (
                    <Marker position={marker} />
                )
            )}
        </MapContainer>
    );
};

export default MapComponent;
