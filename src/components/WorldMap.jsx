import { useMemo, useState } from 'react';
import worldAtlas from 'world-atlas/countries-110m.json';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { ExhibitionCard } from './ExhibitionCard';
import { getMapGroups } from '../data/geo';
import { t } from '../i18n/translate';

const project = ([longitude, latitude]) => [((longitude + 180) / 360) * 1000, ((90 - latitude) / 180) * 500];
const WORLD_COUNTRY_NAMES = { 'United States': 'United States of America' };
const countries = feature(worldAtlas, worldAtlas.objects.countries).features;
// geoPath clips and splits rings at the antimeridian. Directly joining raw
// GeoJSON coordinates creates an erroneous horizontal band for those countries.
const worldPath = geoPath(geoEquirectangular().scale(1000 / (2 * Math.PI)).translate([500, 250]));

export function WorldMap({ locale, events, year, month, onYear, onMonth }) {
  const [selected, setSelected] = useState('');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([500, 250]);
  const [drag, setDrag] = useState(null);
  const groups = useMemo(() => getMapGroups(events, year, month), [events, year, month]);
  const countriesWithEvents = useMemo(() => new Set(groups.map((group) => WORLD_COUNTRY_NAMES[group.country] || group.country)), [groups]);
  const visibleEvents = useMemo(() => selected ? groups.filter((group) => group.key === selected || group.country === selected).flatMap((group) => group.events) : groups.flatMap((group) => group.events), [groups, selected]);
  const selectedGroup = groups.find((group) => group.key === selected);
  const width = 1000 / zoom; const height = 500 / zoom;
  const view = { x: Math.max(0, Math.min(1000 - width, center[0] - width / 2)), y: Math.max(0, Math.min(500 - height, center[1] - height / 2)), width, height };
  const changeMonth = (value) => { setSelected(''); onMonth(value); };
  const changeYear = (value) => { setSelected(''); onYear(value); };
  const selectCountry = (country) => { if (groups.some((group) => group.country === country)) setSelected(country); };
  const changeZoom = (amount) => { const next = Math.max(1, Math.min(3, zoom + amount)); setZoom(next); if (next === 1) setCenter([500, 250]); };
  const startDrag = (event) => { if (zoom === 1) return; event.currentTarget.setPointerCapture?.(event.pointerId); setDrag({ id: event.pointerId, x: event.clientX, y: event.clientY, center }); };
  const moveDrag = (event) => { if (!drag || event.pointerId !== drag.id) return; const rect = event.currentTarget.getBoundingClientRect(); setCenter([drag.center[0] - (event.clientX - drag.x) * width / rect.width, drag.center[1] - (event.clientY - drag.y) * height / rect.height]); };
  const stopDrag = () => setDrag(null);
  const localeCode = locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : locale === 'pt' ? 'pt-BR' : 'en-US';
  const period = new Intl.DateTimeFormat(localeCode, { month: 'long' }).format(new Date(year, month - 1, 1));
  return <div className="map-shell">
    <div className="map-toolbar">
      <div className="map-year-tabs">{[2026, 2027].map((value) => <button key={value} className={year === value ? 'active' : ''} onClick={() => changeYear(value)}>{value} {value === 2027 ? t(locale, 'map.preview') : t(locale, 'map.schedule')}</button>)}</div>
      <div className="map-controls"><button aria-label={t(locale, 'common.zoomOut')} onClick={() => changeZoom(-.5)}>−</button><span>{Math.round(zoom * 100)}%</span><button aria-label={t(locale, 'common.zoomIn')} onClick={() => changeZoom(.5)}>+</button><button onClick={() => { setZoom(1); setCenter([500, 250]); }}>{t(locale, 'common.resetMap')}</button></div>
    </div>
    <div className="map-month-tabs">{Array.from({ length: 12 }, (_, index) => <button key={index} className={month === index + 1 ? 'active' : ''} onClick={() => changeMonth(index + 1)}>{new Intl.DateTimeFormat(localeCode, { month: 'short' }).format(new Date(2026, index, 1))}</button>)}</div>
    <p className="map-period">{year} · {period} · {groups.length ? `${visibleEvents.length} ${t(locale, 'map.events')}` : t(locale, 'map.noEvents')}</p>
    <div className="map-workspace">
      <div className="world-map">
        <svg viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`} role="img" aria-label={t(locale, 'map.distribution')} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} className={drag ? 'is-panning' : ''}>
          <g>{countries.map((country) => { const name = country.properties.name; const active = countriesWithEvents.has(name); return <path key={name} d={worldPath(country) || ''} className={`map-country ${active ? 'has-events' : ''}`} tabIndex={active ? 0 : undefined} role={active ? 'button' : undefined} onClick={() => active && selectCountry(groups.find((group) => (WORLD_COUNTRY_NAMES[group.country] || group.country) === name)?.country)} onKeyDown={(event) => { if (active && (event.key === 'Enter' || event.key === ' ')) selectCountry(groups.find((group) => (WORLD_COUNTRY_NAMES[group.country] || group.country) === name)?.country); }}><title>{name}</title></path>; })}</g>
          {groups.map((group) => { const [x, y] = project([group.longitude, group.latitude]); const selectedMarker = selected === group.key; return <g key={group.key} className={`map-marker ${selectedMarker ? 'selected' : ''}`} role="button" tabIndex="0" onClick={() => setSelected(group.key)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(group.key); }}><circle cx={x} cy={y} r={Math.min(17, 8 + group.events.length)} /><text x={x} y={y + 4} textAnchor="middle">{group.events.length}</text><title>{group.city || group.country} · {group.events.length}</title></g>; })}
        </svg>
      </div>
      <aside className="map-results"><div className="map-results-header"><strong>{selectedGroup ? `${selectedGroup.city || selectedGroup.country}` : selected || t(locale, 'map.allEvents')}</strong>{selected && <button onClick={() => setSelected('')}>{t(locale, 'map.clearSelection')}</button>}</div>{visibleEvents.length ? <div className="expo-grid">{visibleEvents.map((event) => <ExhibitionCard key={event.id} exhibition={event} locale={locale} />)}</div> : <p>{t(locale, 'map.noEvents')}</p>}</aside>
    </div>
  </div>;
}
