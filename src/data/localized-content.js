const CATEGORY_SUMMARIES = {
  en: {
    'new-energy-ev': 'Battery, e-powertrain, charging and electrification technologies.', 'automated-driving': 'ADAS, sensors, domain controllers and automated-driving technologies.', 'thermal-management': 'Thermal management, HVAC, cooling and fluid-system technologies.',
    aftermarket: 'Parts, diagnostics, workshop equipment and aftermarket services.', 'automotive-electronics': 'Vehicle electronics, E/E systems and integration technologies.', 'electronic-components': 'Connectors, harnesses, PCBs and electronic components.',
    'automotive-semiconductors': 'Automotive-grade chips, power semiconductors and electronic architectures.', 'testing-validation': 'Testing, validation, certification and laboratory capabilities.',
    'automotive-supply-chain': 'Automotive supply-chain sourcing, manufacturing and business collaboration.', 'materials-metalworking': 'Materials, metal forming and manufacturing processes.',
    'tooling-stamping': 'Tooling, stamping, die casting and production equipment.', 'surface-treatment': 'Surface engineering, coatings and painting processes.', 'wheels-chassis': 'Chassis, braking, steering, wheels and related components.',
    'vehicle-show': 'Vehicle launches, mobility trends and OEM market activity.', 'connected-cockpit': 'Connected vehicles, intelligent cockpits, communications and HMI.',
    'automotive-software': 'Software-defined vehicles, OTA, AUTOSAR, SOA and cybersecurity.', 'automotive-logistics': 'Vehicle logistics, parts logistics, warehousing and intralogistics.'
  },
  es: {
    'new-energy-ev': 'Tecnologías de baterías, propulsión eléctrica, carga y electrificación.', 'automated-driving': 'Tecnologías de ADAS, sensores, controladores de dominio y conducción automatizada.', 'thermal-management': 'Tecnologías de gestión térmica, HVAC, refrigeración y sistemas de fluidos.',
    aftermarket: 'Recambios, diagnóstico, equipos de taller y servicios de posventa.', 'automotive-electronics': 'Electrónica de vehículo, sistemas E/E y tecnologías de integración.', 'electronic-components': 'Conectores, cableado, PCB y componentes electrónicos.',
    'automotive-semiconductors': 'Chips para automoción, semiconductores de potencia y arquitecturas electrónicas.', 'testing-validation': 'Capacidades de prueba, validación, certificación y laboratorio.',
    'automotive-supply-chain': 'Compras, fabricación y colaboración empresarial en la cadena de suministro automotriz.', 'materials-metalworking': 'Materiales, conformado de metales y procesos de fabricación.',
    'tooling-stamping': 'Herramental, estampación, fundición a presión y equipos de producción.', 'surface-treatment': 'Ingeniería de superficies, recubrimientos y procesos de pintura.', 'wheels-chassis': 'Chasis, frenos, dirección, ruedas y componentes relacionados.',
    'vehicle-show': 'Lanzamientos de vehículos, tendencias de movilidad y actividad de mercado de OEM.', 'connected-cockpit': 'Vehículos conectados, cabinas inteligentes, comunicaciones y HMI.',
    'automotive-software': 'Vehículos definidos por software, OTA, AUTOSAR, SOA y ciberseguridad.', 'automotive-logistics': 'Logística de vehículos y piezas, almacenamiento e intralogística.'
  },
  fr: {
    'new-energy-ev': 'Technologies de batteries, de groupes motopropulseurs électriques, de recharge et d’électrification.', 'automated-driving': 'Technologies ADAS, capteurs, contrôleurs de domaine et conduite automatisée.', 'thermal-management': 'Technologies de gestion thermique, HVAC, refroidissement et circuits de fluides.', aftermarket: 'Pièces, diagnostic, équipements d’atelier et services après-vente.', 'automotive-electronics': 'Électronique automobile, systèmes E/E et technologies d’intégration.', 'electronic-components': 'Connecteurs, faisceaux, PCB et composants électroniques.', 'automotive-semiconductors': 'Puces automobiles, semi-conducteurs de puissance et architectures électroniques.', 'testing-validation': 'Essais, validation, certification et capacités de laboratoire.', 'automotive-supply-chain': 'Achats, fabrication et coopération au sein de la chaîne d’approvisionnement automobile.', 'materials-metalworking': 'Matériaux, formage des métaux et procédés de fabrication.', 'tooling-stamping': 'Outillage, estampage, moulage sous pression et équipements de production.', 'surface-treatment': 'Ingénierie des surfaces, revêtements et procédés de peinture.', 'wheels-chassis': 'Châssis, freinage, direction, roues et composants associés.', 'vehicle-show': 'Lancements de véhicules, tendances de mobilité et activité de marché des OEM.', 'connected-cockpit': 'Véhicules connectés, cockpits intelligents, communications et HMI.', 'automotive-software': 'Véhicules définis par logiciel, OTA, AUTOSAR, SOA et cybersécurité.', 'automotive-logistics': 'Logistique des véhicules et des pièces, stockage et intralogistique.'
  },
  pt: {
    'new-energy-ev': 'Tecnologias de baterias, propulsão elétrica, recarga e eletrificação.', 'automated-driving': 'Tecnologias de ADAS, sensores, controladores de domínio e condução automatizada.', 'thermal-management': 'Tecnologias de gestão térmica, HVAC, arrefecimento e sistemas de fluidos.',
    aftermarket: 'Peças, diagnóstico, equipamentos de oficina e serviços de pós-venda.', 'automotive-electronics': 'Eletrônica veicular, sistemas E/E e tecnologias de integração.', 'electronic-components': 'Conectores, chicotes, PCB e componentes eletrônicos.',
    'automotive-semiconductors': 'Chips automotivos, semicondutores de potência e arquiteturas eletrônicas.', 'testing-validation': 'Capacidades de testes, validação, certificação e laboratório.',
    'automotive-supply-chain': 'Compras, fabricação e colaboração empresarial na cadeia de suprimentos automotiva.', 'materials-metalworking': 'Materiais, conformação de metais e processos de fabricação.',
    'tooling-stamping': 'Ferramentaria, estampagem, fundição sob pressão e equipamentos de produção.', 'surface-treatment': 'Engenharia de superfícies, revestimentos e processos de pintura.', 'wheels-chassis': 'Chassi, freios, direção, rodas e componentes relacionados.',
    'vehicle-show': 'Lançamentos de veículos, tendências de mobilidade e atividade de mercado dos OEMs.', 'connected-cockpit': 'Veículos conectados, cabines inteligentes, comunicações e HMI.',
    'automotive-software': 'Veículos definidos por software, OTA, AUTOSAR, SOA e cibersegurança.', 'automotive-logistics': 'Logística de veículos e peças, armazenagem e intralogística.'
  }
};

export function localizedBusinessContent(exhibition, locale) {
  const content = exhibition.content[locale] || {};
  const generic = CATEGORY_SUMMARIES[locale]?.[exhibition.taxonomy?.categoryId] || (locale === 'pt' ? 'Informações da exposição em processo de verificação.' : locale === 'es' ? 'Información de la feria en proceso de verificación.' : 'English content is being verified.');
  return {
    focus: content.focus || generic,
    audience: content.audience || generic,
    buyerValue: content.buyerValue || [], sellerValue: content.sellerValue || [], buyerTasks: content.buyerTasks || [], sellerTargets: content.sellerTargets || []
  };
}
