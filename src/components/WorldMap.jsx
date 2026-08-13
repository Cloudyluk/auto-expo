import { useMemo } from 'react';
import { t } from '../i18n/translate';

const CENTERS = { CN: [35, 103], US: [39, -98], DE: [51, 10], JP: [36, 138], KR: [36, 128], TH: [15, 101], IN: [22, 79], BR: [-14, -51], GB: [55, -3], FR: [46, 2], IT: [42.5, 12.5], CA: [56, -106], MX: [23, -102], AE: [24, 54], INTL: [20, 20] };
const project = ([longitude, latitude]) => [((longitude + 180) / 360) * 1000, ((90 - latitude) / 180) * 500];
// A deliberately lightweight world silhouette: it keeps the static GitHub Pages
// build self-contained instead of relying on a third-party GeoJSON request.
const CONTINENTS = [
  'M90 95 L250 55 L330 95 L320 185 L245 225 L175 190 L115 150 Z',
  'M280 235 L365 250 L400 350 L360 450 L305 410 L275 315 Z',
  'M450 85 L610 55 L720 95 L705 180 L630 220 L540 180 L470 145 Z',
  'M500 215 L610 225 L650 325 L605 435 L525 390 L475 305 Z',
  'M665 255 L825 225 L905 300 L870 390 L750 405 L690 335 Z',
  'M835 395 L930 385 L955 445 L875 465 Z',
];

export function WorldMap({ locale, counts, labels, onCountry }) {
  const markers = useMemo(() => Object.entries(counts).filter(([code]) => CENTERS[code]).map(([code, count]) => ({ code, count, point: project([CENTERS[code][1], CENTERS[code][0]]) })), [counts]);
  return <div className="world-map" aria-label={t(locale, 'map.distribution')}>
    <svg viewBox="0 0 1000 500" role="img" aria-label={t(locale, 'map.distribution')}>
      <g>{CONTINENTS.map((shape, index) => <path key={index} d={shape} className="map-country" />)}</g>
      {markers.map(({ code, count, point: [x, y] }) => <g key={code} className="map-marker" role="button" tabIndex="0" onClick={() => onCountry(code)} onKeyDown={(event) => { if (event.key === 'Enter') onCountry(code); }}><circle cx={x} cy={y} r={Math.min(18, 7 + count / 7)} /><text x={x} y={y + 4} textAnchor="middle">{count}</text><title>{labels[code]} · {count}</title></g>)}
    </svg>
  </div>;
}
