import { useEffect, useMemo, useState } from 'react';
import { t } from '../i18n/translate';

const CENTERS = { CN: [35, 103], US: [39, -98], DE: [51, 10], JP: [36, 138], KR: [36, 128], TH: [15, 101], IN: [22, 79], BR: [-14, -51], GB: [55, -3], FR: [46, 2], IT: [42.5, 12.5], CA: [56, -106], MX: [23, -102], AE: [24, 54], INTL: [20, 20] };
const WORLD_GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
const project = ([longitude, latitude]) => [((longitude + 180) / 360) * 1000, ((90 - latitude) / 180) * 500];
const pathFor = (geometry) => {
  const rings = geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates.flat();
  return rings.map((ring) => ring.map((point, index) => { const [x, y] = project(point); return `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`; }).join('') + 'Z').join('');
};

export function WorldMap({ locale, counts, labels, onCountry }) {
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    fetch(WORLD_GEOJSON_URL).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => setFeatures(data.features)).catch(() => setFeatures([]));
  }, []);
  const markers = useMemo(() => Object.entries(counts).filter(([code]) => CENTERS[code]).map(([code, count]) => ({ code, count, point: project([CENTERS[code][1], CENTERS[code][0]]) })), [counts]);
  return <div className="world-map" aria-label={t(locale, 'map.distribution')}>
    <svg viewBox="0 0 1000 500" role="img" aria-label={t(locale, 'map.distribution')}>
      <g>{features.map((feature) => <path key={feature.properties.name} d={pathFor(feature.geometry)} className="map-country" />)}</g>
      {markers.map(({ code, count, point: [x, y] }) => <g key={code} className="map-marker" role="button" tabIndex="0" onClick={() => onCountry(code)} onKeyDown={(event) => { if (event.key === 'Enter') onCountry(code); }}><circle cx={x} cy={y} r={Math.min(18, 7 + count / 7)} /><text x={x} y={y + 4} textAnchor="middle">{count}</text><title>{labels[code]} · {count}</title></g>)}
    </svg>
    {!features.length && <p>{t(locale, 'map.loadError')}</p>}
  </div>;
}
