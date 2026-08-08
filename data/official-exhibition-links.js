(function (root) {
  const OFFICIAL_EVENT_LINKS = [
    [/\bCES\b/i, 'https://www.ces.tech/'],
    [/NADA Show/i, 'https://www.nada.org/nada-show'],
    [/Tire Technology Expo/i, 'https://tiretechnology-expo.com/'],
    [/Automotive Logistics.*Global|ALSC Global/i, 'https://alscglobal.automotivelogistics.media/'],
    [/Automotive Logistics.*Europe|ALSC Europe/i, 'https://automotivelogistics.media/events/automotive-logistics-supply-chain-europe'],
    [/\bAMR\b|汽车维修检测诊断设备/i, 'https://auto-maintenance.cn.messefrankfurt.com/beijing/en.html'],
    [/Automechanika Frankfurt/i, 'https://automechanika.messefrankfurt.com/frankfurt/en.html'],
    [/Automechanika Shanghai|上海法兰克福汽配展/i, 'https://automechanika-shanghai.hk.messefrankfurt.com/shanghai/en.html'],
    [/Automechanika Dubai/i, 'https://automechanika-dubai.ae.messefrankfurt.com/dubai/en.html'],
    [/Automechanika Istanbul/i, 'https://automechanika-istanbul.tr.messefrankfurt.com/istanbul/en.html'],
    [/Automechanika Ho Chi Minh/i, 'https://automechanika-hcmc.hk.messefrankfurt.com/hochiminhcity/en.html'],
    [/Automotive Testing Expo|Testing Expo China/i, 'https://www.testing-expo.com/'],
    [/THE TIRE COLOGNE|The Tire Cologne/i, 'https://www.thetirecologne.com/'],
    [/electronica China|慕尼黑上海电子展/i, 'https://electronica-china.com.cn/en/'],
    [/\bAMTS\b/i, 'https://www.amts.com.cn/'],
    [/\bDMC\b|中国国际模具技术和设备展/i, 'https://www.diemouldchina.com/'],
    [/CITEXPO|中国国际轮胎轮毂博览会/i, 'https://www.citexpo.com.cn/'],
    [/Lubricant Expo/i, 'https://www.lubricantexpo.com/'],
    [/IAA Transportation|IAA TRANSPORTATION/i, 'https://www.iaa-transportation.com/en'],
    [/RubberTech China|中国国际橡胶技术展/i, 'https://www.rubbertech-expo.com/'],
    [/EuroBLECH/i, 'https://www.euroblech.com/'],
    [/\bFABTECH\b/i, 'https://www.fabtechexpo.com/'],
    [/Japan Mobility Show/i, 'https://www.japan-mobility-show.com/en/'],
    [/SEMA Show/i, 'https://www.semashow.com/'],
    [/\bAAPEX\b/i, 'https://www.aapexshow.com/'],
    [/CIBF/i, 'https://www.cibf.org.cn/'],
    [/SEMICON China/i, 'https://www.semiconchina.org/'],
    [/Embedded World/i, 'https://www.embedded-world.de/en/'],
    [/世界新能源汽车大会/i, 'https://www.wnevc.org.cn/CN/home/'],
    [/世界智能网联汽车大会|\bWICV\b/i, 'https://www.wicvc.com/index.html'],
    [/中国国际供应链.*博览会|\bCISCE\b/i, 'https://www.cisce.org.cn/'],
    [/AUTOTRONICS TAIPEI/i, 'https://www.taipeiampa.com.tw/en/index.html'],
    [/\bICH2026\b|ICHPM VIETNAM/i, 'https://www.ich-expo.com/'],
    [/\bCEATEC\b/i, 'https://www.ceatec.com/en/application/'],
    [/上海国际紧固件工业博览会|\bIFS China\b/i, 'https://www.afastener.com/'],
    [/Fastener Fair/i, 'https://www.fastenerfairglobal.com/'],
    [/\bEICMA\b/i, 'https://www.eicma.it/en/'],
    [/中国国际进口博览会|\bCIIE\b/i, 'https://www.ciie.org/'],
    [/中国国际机床展览会|\bCIMT\b/i, 'https://www.cimtshow.com/']
  ];

  function getOfficialExhibitionUrl(event) {
    const name = event && event.name ? event.name : '';
    const match = OFFICIAL_EVENT_LINKS.find(([pattern]) => pattern.test(name));
    return match ? match[1] : '';
  }

  root.OFFICIAL_EVENT_LINKS = OFFICIAL_EVENT_LINKS;
  root.getOfficialExhibitionUrl = getOfficialExhibitionUrl;
  if (typeof module !== 'undefined') module.exports = { OFFICIAL_EVENT_LINKS, getOfficialExhibitionUrl };
})(typeof globalThis !== 'undefined' ? globalThis : window);
