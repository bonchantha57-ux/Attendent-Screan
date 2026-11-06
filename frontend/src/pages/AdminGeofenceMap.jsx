import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Compass,
  Navigation,
  CheckCircle,
  AlertCircle,
  Sliders,
  Save,
  Crosshair,
  Info,
  Search,
  Layers,
  Trash2,
  Undo2,
  Square,
  CircleDot,
  X,
  Maximize2,
  Sparkles,
  Building2,
  GraduationCap,
  Store,
  Hotel,
} from 'lucide-react';
import {
  CAMBODIA_LOCATIONS,
  TRANSLITERATION_MAP,
  searchLocalCambodiaLocations,
  parseLocationInput,
} from '../utils/cambodiaLocations';

// Tile Layer Configurations (All 100% Free, High Resolution, Zero API Key Watermarks)
const TILE_PROVIDERS = {
  satellite: {
    id: 'satellite',
    nameKm: 'ផ្កាយរណប (Esri Satellite)',
    nameEn: 'Satellite (Esri Imagery)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar',
    maxZoom: 19,
  },
  osm: {
    id: 'osm',
    nameKm: 'ផែនទីផ្លូវ (OpenStreetMap)',
    nameEn: 'Streets (OpenStreetMap)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  esriStreet: {
    id: 'esriStreet',
    nameKm: 'ផ្លូវទីក្រុង (Esri Streets)',
    nameEn: 'Esri World Street Map',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Sources: Esri, DeLorme, NAVTEQ',
    maxZoom: 19,
  },
};

// Popular Preset Locations in Cambodia for Quick Jump
const PRESET_LOCATIONS = [
  { nameKm: 'សាកលវិទ្យាល័យឌីជីថល (DUC)', nameEn: 'Digital University of Cambodia', lat: 11.4168125, lng: 104.7664375, zoom: 18 },
  { nameKm: 'ខេត្តកំពង់ស្ពឺ (Kampong Speu)', nameEn: 'Kampong Speu Center', lat: 11.4552, lng: 104.5208, zoom: 14 },
  { nameKm: 'សាកលវិទ្យាល័យភូមិន្ទ (RUPP)', nameEn: 'RUPP Campus', lat: 11.5684, lng: 104.8912, zoom: 18 },
  { nameKm: 'ផ្សារទំនើប អ៊ីអន ១ (AEON 1)', nameEn: 'Aeon Mall 1', lat: 11.5478, lng: 104.9317, zoom: 18 },
  { nameKm: 'វិទ្យាស្ថានបច្ចេកវិទ្យា (ITC)', nameEn: 'ITC Techno', lat: 11.5721, lng: 104.8988, zoom: 18 },
  { nameKm: 'រាជធានីភ្នំពេញ (Phnom Penh)', nameEn: 'Phnom Penh Center', lat: 11.5564, lng: 104.9282, zoom: 14 },
  { nameKm: 'ខេត្តសៀមរាប (Siem Reap)', nameEn: 'Siem Reap', lat: 13.3633, lng: 103.8564, zoom: 14 },
];

export default function AdminGeofenceMap() {
  const { lang } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Markers & Overlays refs
  const centerMarkerRef = useRef(null);
  const circleRef = useRef(null);
  const polygonRef = useRef(null);
  const polygonPointMarkersRef = useRef([]);

  // Geofence configuration state
  const [geofenceType, setGeofenceType] = useState('polygon'); // 'circle' | 'polygon'
  const [lat, setLat] = useState(11.4552); // Default to Kampong Speu or RUPP
  const [lng, setLng] = useState(104.5208);
  const [radiusMeters, setRadiusMeters] = useState(200);
  const [enabled, setEnabled] = useState(true);
  const [locationName, setLocationName] = useState('ខេត្តកំពង់ស្ពឺ (Kampong Speu Center)');
  const [polygonCoords, setPolygonCoords] = useState([]);

  // Map Tile layer state
  const [currentTileLayer, setCurrentTileLayer] = useState('satellite');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Status state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [gpsDetecting, setGpsDetecting] = useState(false);

  // Helper to create HTML DivIcon for Center Pin
  const createCenterIcon = () =>
    L.divIcon({
      className: 'custom-center-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab;">
          <div style="width: 24px; height: 24px; background: #10b981; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 20px #10b981; animation: pulse 2s infinite;"></div>
          <div style="background: #0f172a; color: #34d399; font-weight: bold; font-size: 11px; padding: 2px 8px; border-radius: 999px; border: 1px solid #10b981; white-space: nowrap; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
            📍 Gate Screen
          </div>
        </div>
      `,
      iconSize: [80, 50],
      iconAnchor: [40, 12],
    });

  // Helper to create HTML DivIcon for Numbered Polygon Corners (P1, P2, P3, P4...)
  const createCornerIcon = (index) =>
    L.divIcon({
      className: `custom-corner-pin-${index}`,
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: move;">
          <div style="width: 26px; height: 26px; background: #3b82f6; border: 2.5px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(59, 130, 246, 0.8);">
            <span style="color: #ffffff; font-weight: 800; font-size: 11px; font-family: sans-serif;">P${index + 1}</span>
          </div>
          <div style="width: 2px; height: 6px; background: #3b82f6;"></div>
        </div>
      `,
      iconSize: [28, 36],
      iconAnchor: [14, 32],
    });

  // 1. Fetch initial configuration from Backend
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const res = await api.getGeofenceConfig();
        if (res.success) {
          const cLat = res.campusCoordinates?.lat || 11.4552;
          const cLng = res.campusCoordinates?.lng || 104.5208;
          const r = res.radiusMeters || 200;
          setLat(cLat);
          setLng(cLng);
          setRadiusMeters(r);
          setEnabled(res.enabled !== false);
          if (res.locationName) setLocationName(res.locationName);
          if (res.geofenceType) setGeofenceType(res.geofenceType);

          if (Array.isArray(res.polygonCoords) && res.polygonCoords.length >= 3) {
            setPolygonCoords(res.polygonCoords);
            setGeofenceType('polygon');
          } else {
            // Default 4-corner box around center if empty
            generateAutoBox(cLat, cLng, 120);
          }
        }
      } catch (err) {
        console.error('Fetch geofence config error:', err);
        generateAutoBox(11.4552, 104.5208, 120);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Helper: Generate a 4-corner perimeter box around a center coordinate
  const generateAutoBox = (centerLat, centerLng, offsetMeters = 120) => {
    const latOffset = offsetMeters / 111000;
    const lngOffset = offsetMeters / (111000 * Math.cos((centerLat * Math.PI) / 180));

    const box = [
      { lat: Number((centerLat + latOffset).toFixed(6)), lng: Number((centerLng - lngOffset).toFixed(6)) }, // P1: North-West
      { lat: Number((centerLat + latOffset).toFixed(6)), lng: Number((centerLng + lngOffset).toFixed(6)) }, // P2: North-East
      { lat: Number((centerLat - latOffset).toFixed(6)), lng: Number((centerLng + lngOffset).toFixed(6)) }, // P3: South-East
      { lat: Number((centerLat - latOffset).toFixed(6)), lng: Number((centerLng - lngOffset).toFixed(6)) }, // P4: South-West
    ];
    setPolygonCoords(box);
    return box;
  };

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (loading || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
      });

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Default Tile Layer
      const initialLayer = TILE_PROVIDERS[currentTileLayer] || TILE_PROVIDERS.satellite;
      tileLayerRef.current = L.tileLayer(initialLayer.url, {
        attribution: initialLayer.attribution,
        maxZoom: initialLayer.maxZoom,
      }).addTo(map);

      // Add Center Pinpoint Marker
      const centerMarker = L.marker([lat, lng], {
        draggable: true,
        icon: createCenterIcon(),
      }).addTo(map);

      centerMarker.on('drag', (e) => {
        const newPos = e.target.getLatLng();
        setLat(Number(newPos.lat.toFixed(6)));
        setLng(Number(newPos.lng.toFixed(6)));
        if (circleRef.current) circleRef.current.setLatLng(newPos);
      });

      // Add Circle
      const circle = L.circle([lat, lng], {
        radius: radiusMeters,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '6, 6',
      });
      if (geofenceType === 'circle') circle.addTo(map);

      // Add Polygon
      const polygon = L.polygon(
        polygonCoords.map((p) => [p.lat, p.lng]),
        {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.22,
          weight: 3,
          dashArray: '6, 6',
        }
      );
      if (geofenceType === 'polygon' && polygonCoords.length >= 3) {
        polygon.addTo(map);
      }

      // Map Click Event
      map.on('click', (e) => {
        const clickedPos = e.latlng;
        const newPt = {
          lat: Number(clickedPos.lat.toFixed(6)),
          lng: Number(clickedPos.lng.toFixed(6)),
        };

        if (geofenceType === 'polygon') {
          setPolygonCoords((prev) => [...prev, newPt]);
        } else {
          setLat(newPt.lat);
          setLng(newPt.lng);
          centerMarker.setLatLng(clickedPos);
          if (circleRef.current) circleRef.current.setLatLng(clickedPos);
        }
      });

      mapInstanceRef.current = map;
      centerMarkerRef.current = centerMarker;
      circleRef.current = circle;
      polygonRef.current = polygon;
    }

    return () => {};
  }, [loading]);

  // 3. Switch Tile Layer (Street, Satellite, Esri)
  const changeTileLayer = (layerKey) => {
    if (!mapInstanceRef.current || !TILE_PROVIDERS[layerKey]) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const layerConf = TILE_PROVIDERS[layerKey];
    tileLayerRef.current = L.tileLayer(layerConf.url, {
      attribution: layerConf.attribution,
      maxZoom: layerConf.maxZoom,
    }).addTo(mapInstanceRef.current);
    setCurrentTileLayer(layerKey);
  };

  // 4. Update Visuals when Mode (Circle / Polygon) Toggles
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (geofenceType === 'circle') {
      if (polygonRef.current && map.hasLayer(polygonRef.current)) {
        map.removeLayer(polygonRef.current);
      }
      polygonPointMarkersRef.current.forEach((m) => map.removeLayer(m));
      if (circleRef.current && !map.hasLayer(circleRef.current)) {
        circleRef.current.addTo(map);
      }
    } else {
      if (circleRef.current && map.hasLayer(circleRef.current)) {
        map.removeLayer(circleRef.current);
      }
      if (polygonRef.current && !map.hasLayer(polygonRef.current) && polygonCoords.length >= 3) {
        polygonRef.current.addTo(map);
      }
    }
  }, [geofenceType]);

  // 5. Update Polygon & Corner Markers Live
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonRef.current) return;
    const map = mapInstanceRef.current;

    polygonPointMarkersRef.current.forEach((m) => map.removeLayer(m));
    polygonPointMarkersRef.current = [];

    if (geofenceType === 'polygon') {
      const latLngs = polygonCoords.map((p) => [p.lat, p.lng]);
      polygonRef.current.setLatLngs(latLngs);

      if (polygonCoords.length >= 3) {
        if (!map.hasLayer(polygonRef.current)) polygonRef.current.addTo(map);
      } else {
        if (map.hasLayer(polygonRef.current)) map.removeLayer(polygonRef.current);
      }

      // Add Draggable Numbered Markers for each Polygon Point (P1, P2, P3, P4...)
      polygonCoords.forEach((pt, idx) => {
        const marker = L.marker([pt.lat, pt.lng], {
          draggable: true,
          icon: createCornerIcon(idx),
        }).addTo(map);

        marker.on('drag', (e) => {
          const newPos = e.target.getLatLng();
          setPolygonCoords((prev) => {
            const updated = [...prev];
            updated[idx] = {
              lat: Number(newPos.lat.toFixed(6)),
              lng: Number(newPos.lng.toFixed(6)),
            };
            return updated;
          });
        });

        polygonPointMarkersRef.current.push(marker);
      });
    }
  }, [polygonCoords, geofenceType]);

  // 6. Update Circle Radius Live
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radiusMeters);
    }
  }, [radiusMeters]);

  // =========================================================================
  // MULTI-ENGINE COMPREHENSIVE LOCATION SEARCH (Sees ALL Locations)
  // Combines:
  // 1. Built-in High-Speed Cambodia Registry (all provinces, districts, institutions)
  // 2. Photon Geocoder (Elasticsearch on OpenStreetMap with fuzzy search)
  // 3. Nominatim Geocoder (Official OpenStreetMap API)
  // 4. Khmer <-> English Automatic Transliteration
  // =========================================================================
  const performSearch = async (queryText) => {
    if (!queryText || !queryText.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const cleanQuery = queryText.trim();

    // Step 0: Check if user pasted a Google Maps URL or Direct GPS coordinates
    const directLocation = parseLocationInput(cleanQuery);
    if (directLocation) {
      setSearchResults([directLocation]);
      setShowDropdown(false);
      handleSelectLocation(directLocation);
      return;
    }

    setSearching(true);
    setShowDropdown(true);

    try {
      // Step A: Local High-Speed Cambodia Match (Instant 0ms)
      const localMatches = searchLocalCambodiaLocations(cleanQuery).map((loc) => ({
        id: `local-${loc.nameKm}`,
        name: loc.nameKm,
        nameSecondary: loc.nameEn,
        category: loc.categoryKm || '📍 ទីតាំង',
        lat: loc.lat,
        lng: loc.lng,
        zoom: loc.zoom || 17,
        source: 'local',
      }));

      // Step B: Determine Transliteration (e.g. កំពង់ស្ពឺ -> Kampong Speu)
      let englishKeyword = null;
      for (const [kh, en] of Object.entries(TRANSLITERATION_MAP)) {
        if (cleanQuery.includes(kh)) {
          englishKeyword = en;
          break;
        }
      }

      // Step C: Fetch Online Geocoders in Parallel
      const onlineQueries = [cleanQuery];
      if (englishKeyword && !cleanQuery.toLowerCase().includes(englishKeyword.toLowerCase())) {
        onlineQueries.push(englishKeyword);
      }

      const fetchPromises = [];

      // 1. Photon Geocoder API (Very fast, handles Cambodia exceptionally well)
      for (const q of onlineQueries) {
        fetchPromises.push(
          fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=12`)
            .then((r) => r.json())
            .then((data) => {
              if (!data || !data.features) return [];
              return data.features.map((f, i) => {
                const p = f.properties || {};
                const coords = f.geometry?.coordinates || [0, 0];
                const primaryName = p.name || p.street || `${p.city || cleanQuery}`;
                const secondary = [p.street, p.city, p.state, p.country].filter(Boolean).join(', ');
                return {
                  id: `photon-${i}-${coords[1]}-${coords[0]}`,
                  name: primaryName,
                  nameSecondary: secondary,
                  category: p.type === 'state' ? '🏛️ ខេត្ត' : p.type === 'city' ? '🏙️ ក្រុង' : '📍 ទីតាំង OSM',
                  lat: coords[1],
                  lng: coords[0],
                  zoom: p.type === 'state' || p.type === 'city' ? 14 : 17,
                  source: 'photon',
                };
              });
            })
            .catch(() => [])
        );
      }

      // 2. Nominatim Geocoder API
      for (const q of onlineQueries) {
        fetchPromises.push(
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              q
            )}&countrycodes=kh&limit=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'km,en' } }
          )
            .then((r) => r.json())
            .then((data) => {
              if (!Array.isArray(data)) return [];
              return data.map((item, i) => ({
                id: `nom-${i}-${item.lat}-${item.lon}`,
                name: item.name || item.display_name.split(',')[0],
                nameSecondary: item.display_name,
                category: item.type === 'administrative' ? '🏛️ តំបន់រដ្ឋបាល' : '📍 ផែនទីផ្លូវការ',
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                zoom: item.type === 'administrative' ? 14 : 17,
                source: 'nominatim',
              }));
            })
            .catch(() => [])
        );
      }

      // Step D: Await all and merge
      const onlineResultsNested = await Promise.all(fetchPromises);
      const onlineResults = onlineResultsNested.flat();

      // Step E: Deduplicate results by proximity (< 80 meters) and combine
      const combined = [...localMatches];
      for (const item of onlineResults) {
        const isDuplicate = combined.some((existing) => {
          const latDiff = Math.abs(existing.lat - item.lat);
          const lngDiff = Math.abs(existing.lng - item.lng);
          return (latDiff < 0.0008 && lngDiff < 0.0008) || existing.name === item.name;
        });
        if (!isDuplicate) {
          combined.push(item);
        }
      }

      setSearchResults(combined.slice(0, 20));
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  // Live Auto-Suggest as user types (Debounced 250ms)
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(val);
    }, 250);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    performSearch(searchQuery);
  };

  // Select Search Result or Preset Location
  const handleSelectLocation = (item) => {
    const targetLat = parseFloat(item.lat);
    const targetLng = parseFloat(item.lng || item.lon);
    const targetZoom = item.zoom || 17;

    setLat(targetLat);
    setLng(targetLng);
    setLocationName(item.name || item.nameKm);
    setShowDropdown(false);
    setSearchQuery('');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([targetLat, targetLng], targetZoom, { duration: 1.5 });
      centerMarkerRef.current?.setLatLng([targetLat, targetLng]);
      circleRef.current?.setLatLng([targetLat, targetLng]);

      // If polygon, generate box around new location
      if (geofenceType === 'polygon') {
        generateAutoBox(targetLat, targetLng, targetZoom <= 14 ? 300 : 120);
      }
    }
  };

  // Auto-detect Admin's current GPS location
  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Browser របស់អ្នកមិនគាំទ្រ Geolocation ទេ');
      return;
    }
    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = Number(pos.coords.latitude.toFixed(6));
        const userLng = Number(pos.coords.longitude.toFixed(6));
        setLat(userLat);
        setLng(userLng);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([userLat, userLng], 18, { duration: 1.2 });
          centerMarkerRef.current?.setLatLng([userLat, userLng]);
          circleRef.current?.setLatLng([userLat, userLng]);
          if (geofenceType === 'polygon') {
            generateAutoBox(userLat, userLng, 100);
          }
        }
        setGpsDetecting(false);
      },
      (err) => {
        alert('មិនអាចទាញយក GPS បានទេ: ' + err.message);
        setGpsDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Save updated Geofence to Backend
  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      setSaveMessage('');

      if (geofenceType === 'polygon' && polygonCoords.length < 3) {
        alert(
          lang === 'km'
            ? 'សូមដៅយ៉ាងតិច ៣ ឬ ៤ ចំណុចដើម្បីបង្កើតបរិវេណពហុកោណ (Please plot at least 3 points)'
            : 'Please plot at least 3 or 4 points for polygon perimeter'
        );
        setSaving(false);
        return;
      }

      const res = await api.updateGeofenceConfig({
        lat,
        lng,
        radiusMeters,
        enabled,
        locationName,
        geofenceType,
        polygonCoords,
      });

      if (res.success) {
        setSaveMessage(
          lang === 'km'
            ? `✅ បានរក្សាទុកទីតាំង និងបរិវេណស្កេនជោគជ័យ! (${geofenceType === 'polygon' ? `${polygonCoords.length} ជ្រុង` : `${radiusMeters}m`})`
            : `✅ Geofence perimeter successfully saved! (${geofenceType.toUpperCase()} mode)`
        );
        setTimeout(() => setSaveMessage(''), 4500);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'km' ? 'កំណត់ទីតាំង & បរិវេណស្កេន (Geofence Map)' : 'Location & Geofencing Perimeter Map'}
            </h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live GPS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km'
              ? 'ស្វែងរកទីតាំងក្នុងប្រទេសកម្ពុជាឃើញទាំងអស់ (ខេត្ត, ក្រុង, ស្រុក, សាលារៀន, ផ្សារ...) និងដៅចំណុច ៤ ជ្រុង'
              : 'Search all locations in Cambodia (Provinces, Cities, Districts, Schools, Malls) & plot 4-corner boundary'}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{lang === 'km' ? 'រក្សាទុកទីតាំង (Save Location)' : 'Save Geofence'}</span>
            </>
          )}
        </button>
      </div>

      {saveMessage && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* COMPREHENSIVE SEARCH BAR (FINDS EVERYTHING) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 relative z-30">
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder={
                lang === 'km'
                  ? '🔍 វាយឈ្មោះទីតាំង (ឧ. សាកលវិទ្យាល័យឌីជីថលកម្ពុជា, RUPP...) ឬ Paste Link / កូអរដោនេពី Google Maps'
                  : 'Search name (e.g. Digital University of Cambodia, RUPP...) or Paste Google Maps Link / GPS'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={searching}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/30"
          >
            {searching ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>{lang === 'km' ? 'ស្វែងរក' : 'Search'}</span>
          </button>
        </form>

        {/* Helpful Tip for Google Maps Users */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/60">
          <span className="text-amber-400 font-bold shrink-0">💡 គន្លឹះ៖</span>
          <span className="line-clamp-1">
            {lang === 'km'
              ? 'អាចស្វែងរកឈ្មោះសាលា ឬ Copy Link ពី Google Maps / កូអរដោនេ (GPS) មក Paste ទីនេះបានភ្លាមៗ!'
              : 'Search place name, or Copy & Paste a Google Maps Link / GPS coordinates directly!'}
          </span>
        </div>

        {/* Live Search Results Dropdown (Rich & Comprehensive) */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-4 right-4 top-16 bg-slate-950/98 backdrop-blur-xl border border-slate-800 rounded-2xl p-2.5 shadow-2xl space-y-1.5 max-h-80 overflow-y-auto z-50">
            <div className="flex items-center justify-between px-2.5 py-1 text-[11px] text-slate-400 font-semibold border-b border-slate-800/80">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {lang === 'km'
                  ? `រកឃើញ ${searchResults.length} ទីតាំងនៅកម្ពុជា៖`
                  : `Found ${searchResults.length} locations:`}
              </span>
              <button
                type="button"
                onClick={() => setShowDropdown(false)}
                className="text-slate-500 hover:text-white text-[10px]"
              >
                {lang === 'km' ? 'បិទ [Esc]' : 'Close'}
              </button>
            </div>

            {searchResults.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => handleSelectLocation(item)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/90 text-xs text-slate-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-bold shrink-0 mt-0.5">
                    {item.category}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.name}
                    </div>
                    {item.nameSecondary && (
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.nameSecondary}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-indigo-400 font-mono font-bold shrink-0 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {lang === 'km' ? 'ទៅកាន់' : 'Jump'} ➔
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Location Preset Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {lang === 'km' ? 'ទីតាំងរហ័ស:' : 'Quick Jump:'}
          </span>
          {PRESET_LOCATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectLocation(preset)}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all"
            >
              {lang === 'km' ? preset.nameKm : preset.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) & Interactive Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Controls Card */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          {/* Header & Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'km' ? 'ការកំណត់បរិវេណ' : 'Perimeter Configuration'}</span>
            </h3>

            {/* Enable/Disable Geofence Switch */}
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className={`text-[11px] font-bold ${enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {enabled ? 'បើក (Active)' : 'បិទ (Off)'}
              </span>
            </label>
          </div>

          {/* Mode Selector: 4-Corner Polygon vs Circle Radius */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {lang === 'km' ? 'ទម្រង់កំណត់បរិវេណ (Boundary Mode)' : 'Perimeter Mode'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setGeofenceType('polygon')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  geofenceType === 'polygon'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? '៤ ជ្រុង / ពហុកោណ' : 'Polygon Box'}</span>
              </button>

              <button
                type="button"
                onClick={() => setGeofenceType('circle')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  geofenceType === 'circle'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'រង្វង់កាំម៉ែត្រ' : 'Circle Radius'}</span>
              </button>
            </div>
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'km' ? 'ឈ្មោះទីតាំង / អគារ / មាត់ទ្វារ' : 'Location / Campus Name'}
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>

          {/* POLYGON MODE CONTROLS */}
          {geofenceType === 'polygon' ? (
            <div className="space-y-3 p-3.5 bg-blue-950/20 border border-blue-900/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'km' ? 'ចំណុចដៅពហុកោណ៖' : 'Plotted Polygon Corners:'}</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                  {polygonCoords.length} {lang === 'km' ? 'ចំណុច' : 'Points'}
                </span>
              </div>

              {/* Action Buttons for Polygon */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => generateAutoBox(lat, lng, 120)}
                  className="py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Square className="w-3 h-3" />
                  <span>{lang === 'km' ? '⚡ ប្រអប់ ៤ ជ្រុង' : 'Auto 4-Box'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPolygonCoords((prev) => prev.slice(0, -1))}
                  disabled={polygonCoords.length === 0}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>{lang === 'km' ? 'ត្រឡប់ចុងក្រោយ' : 'Undo Point'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPolygonCoords([])}
                disabled={polygonCoords.length === 0}
                className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                <span>{lang === 'km' ? 'លុបចំណុចទាំងអស់ (Clear All)' : 'Clear All Points'}</span>
              </button>

              {/* Points List */}
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {polygonCoords.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono"
                  >
                    <span className="text-blue-400 font-bold">P{idx + 1}:</span>
                    <span className="text-slate-300">
                      {pt.lat}, {pt.lng}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPolygonCoords((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* CIRCLE RADIUS CONTROLS */
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  {lang === 'km' ? 'កាំរង្វង់អនុញ្ញាត (Radius)' : 'Allowable Radius:'}
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {radiusMeters} ម៉ែត្រ ({radiusMeters}m)
                </span>
              </div>

              <input
                type="range"
                min="30"
                max="1500"
                step="10"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[50, 100, 200, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRadiusMeters(preset)}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      radiusMeters === preset
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Pinpoint Coordinate Display */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 font-mono">
                Lat (រយៈទទឹង)
              </label>
              <input
                type="number"
                step="0.000001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 font-mono">
                Lng (រយៈបណ្តោយ)
              </label>
              <input
                type="number"
                step="0.000001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          {/* Use My Current GPS Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={gpsDetecting}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${gpsDetecting ? 'animate-spin' : ''}`} />
            <span>
              {gpsDetecting
                ? lang === 'km'
                  ? 'កំពុងចាប់ទីតាំង GPS...'
                  : 'Detecting GPS...'
                : lang === 'km'
                ? '📍 ចាប់ទីតាំង GPS បច្ចុប្បន្នរបស់ខ្ញុំ'
                : 'Use My Current GPS Location'}
            </span>
          </button>

          {/* Instructions Guide */}
          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{lang === 'km' ? 'ការណែនាំដៅចំណុច៖' : 'How to use map:'}</span>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[10px] leading-relaxed">
              <li>
                {lang === 'km'
                  ? 'ចុចលើផែនទីដើម្បីដៅចំណុចជ្រុង P1, P2, P3, P4 ព័ទ្ធជុំវិញរបងសាលា'
                  : 'Click anywhere on map to plot perimeter corners P1, P2, P3, P4'}
              </li>
              <li>
                {lang === 'km'
                  ? 'អាចចាប់ទាញ (Drag) ចំណុច P1-P4 នីមួយៗឱ្យត្រូវទំហំដី ឬរបងជាក់ស្តែង'
                  : 'Drag corner markers directly to align with campus boundaries'}
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Map View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl flex flex-col relative overflow-hidden">
          {/* Map Top Bar with Layer Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 px-1 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="font-bold text-white text-xs sm:text-sm">
                {lang === 'km' ? 'ផែនទីផ្កាយរណប & ផ្លូវច្បាស់លាស់ (Live Map)' : 'High-Resolution Map View'}
              </span>
            </div>

            {/* Map Style Layer Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => changeTileLayer('satellite')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentTileLayer === 'satellite'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛰️ {lang === 'km' ? 'ផ្កាយរណប' : 'Satellite'}
              </button>
              <button
                type="button"
                onClick={() => changeTileLayer('osm')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentTileLayer === 'osm'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗺️ {lang === 'km' ? 'ផ្លូវ (OSM)' : 'Streets'}
              </button>
              <button
                type="button"
                onClick={() => changeTileLayer('esriStreet')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  currentTileLayer === 'esriStreet'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏙️ Esri
              </button>
            </div>
          </div>

          {/* Leaflet Map Canvas Container */}
          <div className="relative w-full h-[450px] sm:h-[560px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner z-10">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Floating Top-Left Status Badge */}
            <div className="absolute top-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-medium text-[11px] line-clamp-1 max-w-[200px] sm:max-w-[320px]">
                {locationName}
              </span>
              <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/30 shrink-0">
                {geofenceType === 'polygon'
                  ? `${polygonCoords.length} ជ្រុង (Corners)`
                  : `±${radiusMeters}m`}
              </span>
            </div>

            {/* Floating Helper Tip in Polygon Mode */}
            {geofenceType === 'polygon' && (
              <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/40 text-[10px] text-blue-200 shadow-xl flex items-center gap-2">
                <Square className="w-3 h-3 text-blue-400" />
                <span>
                  {lang === 'km'
                    ? 'ចុចលើផែនទីដើម្បីបន្ថែមចំណុច ឬអូសចំណុច P1-P4 ដើម្បីតម្រង់'
                    : 'Click map to add points, drag P1-P4 to align boundary'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
