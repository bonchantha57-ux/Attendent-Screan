/**
 * Geolocation & Geofencing utility functions
 * Supports both Circle Radius (Haversine) and Multi-point / 4-corner Polygon Perimeter (Ray-Casting)
 */

// Haversine Formula for Distance in Meters
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (value) => (value * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Standard Ray-Casting Algorithm to test if a point (lat, lng) is inside a polygon
 * @param {{ lat: number, lng: number }} point
 * @param {Array<{ lat: number, lng: number }>} polygon
 * @returns {boolean}
 */
function isPointInPolygon(point, polygon) {
  if (!polygon || !Array.isArray(polygon) || polygon.length < 3) {
    return false;
  }

  const x = Number(point.lng);
  const y = Number(point.lat);
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = Number(polygon[i].lng);
    const yi = Number(polygon[i].lat);
    const xj = Number(polygon[j].lng);
    const yj = Number(polygon[j].lat);

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calculate polygon centroid (center)
 */
function calculatePolygonCentroid(polygon) {
  if (!polygon || polygon.length === 0) return { lat: 11.5564, lng: 104.9282 };
  let sumLat = 0;
  let sumLng = 0;
  for (const pt of polygon) {
    sumLat += Number(pt.lat);
    sumLng += Number(pt.lng);
  }
  return {
    lat: sumLat / polygon.length,
    lng: sumLng / polygon.length,
  };
}

/**
 * Verify Geofence supporting both Circle and Polygon modes
 */
function verifyUnifiedGeofence({ userLat, userLng, geoConfig }) {
  if (userLat === undefined || userLng === undefined) {
    return {
      allowed: false,
      distance: null,
      message: 'GPS coordinates missing. Please enable location on your device.',
    };
  }

  const mode = geoConfig.geofenceType || (geoConfig.polygonCoords?.length >= 3 ? 'polygon' : 'circle');

  // MODE 1: Polygon Boundary (៤ ជ្រុង ឬច្រើនចំណុច)
  if (mode === 'polygon' && Array.isArray(geoConfig.polygonCoords) && geoConfig.polygonCoords.length >= 3) {
    const inside = isPointInPolygon({ lat: userLat, lng: userLng }, geoConfig.polygonCoords);
    const centroid = calculatePolygonCentroid(geoConfig.polygonCoords);
    const distToCenter = calculateDistanceInMeters(userLat, userLng, centroid.lat, centroid.lng);

    return {
      allowed: inside,
      mode: 'polygon',
      distance: distToCenter,
      pointsCount: geoConfig.polygonCoords.length,
      message: inside
        ? `អ្នកស្ថិតនៅក្នុងបរិវេណពហុកោណអនុញ្ញាត (${geoConfig.polygonCoords.length} ជ្រុង, ចម្ងាយ ${distToCenter}m ពីកណ្តាល)`
        : `អ្នកស្ថិតនៅក្រៅបរិវេណពហុកោណ ${geoConfig.polygonCoords.length} ជ្រុង (${distToCenter}m ពីចំណុចកណ្តាល)!`,
    };
  }

  // MODE 2: Circle Radius
  const campusLat = geoConfig.lat || 11.5564;
  const campusLng = geoConfig.lng || 104.9282;
  const allowedRadiusMeters = geoConfig.radiusMeters || 200;

  const distance = calculateDistanceInMeters(userLat, userLng, campusLat, campusLng);
  const allowed = distance <= allowedRadiusMeters;

  return {
    allowed,
    mode: 'circle',
    distance,
    maxRadius: allowedRadiusMeters,
    message: allowed
      ? `Within campus perimeter (${distance}m away)`
      : `Outside campus perimeter (${distance}m away, maximum allowed is ${allowedRadiusMeters}m)`,
  };
}

module.exports = {
  calculateDistanceInMeters,
  isPointInPolygon,
  calculatePolygonCentroid,
  verifyUnifiedGeofence,
  verifyGeofence: (userLat, userLng, campusLat, campusLng, radius = 200) =>
    verifyUnifiedGeofence({
      userLat,
      userLng,
      geoConfig: { lat: campusLat, lng: campusLng, radiusMeters: radius, geofenceType: 'circle' },
    }),
};
