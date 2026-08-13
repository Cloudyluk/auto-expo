export const CATEGORY_IDS = {
  '二手车/经典车': 'used-classic-vehicles', '商用车': 'commercial-vehicles', '摩托车': 'motorcycles', '改装展': 'customization', '整车车展': 'vehicle-show',
  '新能源/EV': 'new-energy-ev', '智能驾驶': 'automated-driving', '材料/金属加工': 'materials-metalworking', '模具/冲压': 'tooling-stamping', '汽车CMF': 'automotive-cmf',
  '汽车NVH': 'automotive-nvh', '汽车供应链': 'automotive-supply-chain', '汽车内外饰': 'interior-exterior', '汽车半导体/芯片': 'automotive-semiconductors', '汽车安全': 'automotive-safety',
  '汽车座椅': 'automotive-seating', '汽车技术': 'automotive-technology', '汽车测试/验证': 'testing-validation', '汽车照明': 'automotive-lighting', '汽车物流': 'automotive-logistics',
  '汽车电子': 'automotive-electronics', '汽车电子元器件': 'electronic-components', '汽车维修设备': 'repair-equipment', '汽车设计/工程服务': 'design-engineering', '汽车软件/OTA': 'automotive-software',
  '汽车轻量化': 'lightweighting', '汽车金融/保险': 'finance-insurance', '汽配/汽保': 'aftermarket', '润滑油/养护品': 'lubricants-care', '热管理/空调': 'thermal-management',
  '紧固件': 'fasteners', '表面处理/涂装': 'surface-treatment', '赛车/摩托运动': 'motorsport', '车联网/座舱': 'connected-cockpit', '轮毂/底盘件': 'wheels-chassis', '轮胎/橡胶': 'tyres-rubber'
};

const CATEGORY_LABELS = {
  en: {
    'used-classic-vehicles': 'Used & Classic Vehicles', 'commercial-vehicles': 'Commercial Vehicles', motorcycles: 'Motorcycles', customization: 'Customization', 'vehicle-show': 'Vehicle Show',
    'new-energy-ev': 'New Energy & EV', 'automated-driving': 'Automated Driving', 'materials-metalworking': 'Materials & Metalworking', 'tooling-stamping': 'Tooling & Stamping', 'automotive-cmf': 'Automotive CMF',
    'automotive-nvh': 'Automotive NVH', 'automotive-supply-chain': 'Automotive Supply Chain', 'interior-exterior': 'Interior & Exterior', 'automotive-semiconductors': 'Automotive Semiconductors', 'automotive-safety': 'Automotive Safety',
    'automotive-seating': 'Automotive Seating', 'automotive-technology': 'Automotive Technology', 'testing-validation': 'Testing & Validation', 'automotive-lighting': 'Automotive Lighting', 'automotive-logistics': 'Automotive Logistics',
    'automotive-electronics': 'Automotive Electronics', 'electronic-components': 'Electronic Components', 'repair-equipment': 'Repair Equipment', 'design-engineering': 'Design & Engineering Services', 'automotive-software': 'Automotive Software & OTA',
    lightweighting: 'Lightweighting', 'finance-insurance': 'Automotive Finance & Insurance', aftermarket: 'Aftermarket', 'lubricants-care': 'Lubricants & Car Care', 'thermal-management': 'Thermal Management & HVAC',
    fasteners: 'Fasteners', 'surface-treatment': 'Surface Treatment & Coating', motorsport: 'Motorsport', 'connected-cockpit': 'Connected Vehicle & Cockpit', 'wheels-chassis': 'Wheels & Chassis', 'tyres-rubber': 'Tyres & Rubber'
  },
  es: {
    'used-classic-vehicles': 'Vehículos usados y clásicos', 'commercial-vehicles': 'Vehículos comerciales', motorcycles: 'Motocicletas', customization: 'Personalización', 'vehicle-show': 'Salón del automóvil',
    'new-energy-ev': 'Nueva energía y vehículos eléctricos', 'automated-driving': 'Conducción automatizada', 'materials-metalworking': 'Materiales y metalmecánica', 'tooling-stamping': 'Herramental y estampación', 'automotive-cmf': 'CMF automotriz',
    'automotive-nvh': 'NVH automotriz', 'automotive-supply-chain': 'Cadena de suministro automotriz', 'interior-exterior': 'Interior y exterior', 'automotive-semiconductors': 'Semiconductores para automoción', 'automotive-safety': 'Seguridad automotriz',
    'automotive-seating': 'Asientos automotrices', 'automotive-technology': 'Tecnología automotriz', 'testing-validation': 'Pruebas y validación', 'automotive-lighting': 'Iluminación automotriz', 'automotive-logistics': 'Logística automotriz',
    'automotive-electronics': 'Electrónica automotriz', 'electronic-components': 'Componentes electrónicos', 'repair-equipment': 'Equipos de reparación', 'design-engineering': 'Diseño e ingeniería', 'automotive-software': 'Software automotriz y OTA',
    lightweighting: 'Aligeramiento', 'finance-insurance': 'Financiación y seguros de automoción', aftermarket: 'Posventa', 'lubricants-care': 'Lubricantes y cuidado del automóvil', 'thermal-management': 'Gestión térmica y HVAC',
    fasteners: 'Elementos de fijación', 'surface-treatment': 'Tratamiento de superficies y pintura', motorsport: 'Deporte del motor', 'connected-cockpit': 'Vehículo conectado y cabina', 'wheels-chassis': 'Ruedas y chasis', 'tyres-rubber': 'Neumáticos y caucho'
  },
  zh: Object.fromEntries(Object.entries(CATEGORY_IDS).map(([label, id]) => [id, label]))
};

export function categoryLabel(categoryId, locale) {
  return CATEGORY_LABELS[locale]?.[categoryId] || categoryId;
}
