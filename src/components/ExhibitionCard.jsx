import { categoryLabel } from '../data/taxonomy';
import { getLocalizedExhibition } from '../data/exhibitions';
import { t } from '../i18n/translate';
import { officialName } from '../i18n/translate';
import { localizeDate, localizeLocation } from '../data/display';

export function ExhibitionCard({ exhibition, locale }) {
  const content = getLocalizedExhibition(exhibition, locale);
  return <article className="expo-card">
    <h3 data-official-name="true">{officialName(exhibition, locale)}</h3>
    <p className="meta">{categoryLabel(exhibition.taxonomy.categoryId, locale)} · {localizeDate(exhibition.date.label, locale)} · {localizeLocation(exhibition.location.label, locale)}</p>
    <p><strong>{t(locale, 'common.focus')}:</strong> {content.focus}</p>
    {exhibition.official.url && <a href={exhibition.official.url} target="_blank" rel="noreferrer">{t(locale, 'common.officialWebsite')} ↗</a>}
  </article>;
}
