export const SALES_ROUTES = {
  "production": {
    "label": "量产供应链"
  },
  "channel": {
    "label": "渠道与售后"
  },
  "project": {
    "label": "项目与生态"
  }
};
export const SALES_RULES = {
  "engine": {
    "routes": [
      "production"
    ],
    "buyers": [
      "OEM动力总成采购",
      "发动机Tier 1"
    ],
    "specifiers": [
      "动力研发",
      "标定与质量"
    ],
    "modes": [
      "定点直销"
    ],
    "partners": [
      "本地技术服务"
    ]
  },
  "fuel-emission": {
    "routes": [
      "production"
    ],
    "buyers": [
      "发动机Tier 1",
      "排放系统供应商"
    ],
    "specifiers": [
      "动力研发",
      "法规认证"
    ],
    "modes": [
      "定点直销"
    ],
    "partners": [
      "认证与测试机构"
    ]
  },
  "driveline": {
    "routes": [
      "production",
      "channel"
    ],
    "buyers": [
      "底盘Tier 1",
      "OEM售后采购"
    ],
    "specifiers": [
      "底盘研发",
      "质量"
    ],
    "modes": [
      "定点直销",
      "区域分销"
    ],
    "partners": [
      "区域仓与售后服务商"
    ]
  },
  "tyre-safety": {
    "routes": [
      "production",
      "channel"
    ],
    "buyers": [
      "轮胎厂",
      "OEM售后采购",
      "维修连锁"
    ],
    "specifiers": [
      "底盘与安全研发",
      "质量"
    ],
    "modes": [
      "直销",
      "总代分销"
    ],
    "partners": [
      "进口商",
      "区域经销商"
    ]
  },
  "thermal": {
    "routes": [
      "production",
      "channel"
    ],
    "buyers": [
      "热管理Tier 1",
      "OEM售后采购"
    ],
    "specifiers": [
      "热管理研发",
      "质量"
    ],
    "modes": [
      "定点直销",
      "区域分销"
    ],
    "partners": [
      "FAE与售后服务商"
    ]
  },
  "body": {
    "routes": [
      "production"
    ],
    "buyers": [
      "车身与内饰Tier 1",
      "OEM采购"
    ],
    "specifiers": [
      "车身设计",
      "CMF与质量"
    ],
    "modes": [
      "定点直销"
    ],
    "partners": [
      "模具与工艺服务商"
    ]
  },
  "structure": {
    "routes": [
      "production"
    ],
    "buyers": [
      "车身结构Tier 1",
      "冲压压铸厂"
    ],
    "specifiers": [
      "车身工程",
      "材料工程"
    ],
    "modes": [
      "定点直销"
    ],
    "partners": [
      "模具与材料服务商"
    ]
  },
  "electrical": {
    "routes": [
      "production",
      "channel"
    ],
    "buyers": [
      "线束厂",
      "EMS",
      "电子Tier 1"
    ],
    "specifiers": [
      "电子电气研发",
      "质量"
    ],
    "modes": [
      "量产直销",
      "区域分销"
    ],
    "partners": [
      "FAE",
      "区域库存商"
    ]
  },
  "manufacturing": {
    "routes": [
      "project"
    ],
    "buyers": [
      "OEM工厂",
      "Tier 1工厂"
    ],
    "specifiers": [
      "制造工程",
      "工厂物流"
    ],
    "modes": [
      "项目销售"
    ],
    "partners": [
      "系统集成商",
      "设备代理商"
    ]
  },
  "cell-materials": {
    "routes": [
      "production"
    ],
    "buyers": [
      "电池厂",
      "材料厂",
      "PACK厂"
    ],
    "specifiers": [
      "电池研发",
      "质量与EHS"
    ],
    "modes": [
      "战略直销"
    ],
    "partners": [
      "检测与认证机构"
    ]
  },
  "bms-safety": {
    "routes": [
      "production",
      "project"
    ],
    "buyers": [
      "PACK厂",
      "电池Tier 1",
      "OEM三电平台"
    ],
    "specifiers": [
      "BMS研发",
      "功能安全"
    ],
    "modes": [
      "方案直销",
      "联合开发"
    ],
    "partners": [
      "测试验证伙伴"
    ]
  },
  "pack": {
    "routes": [
      "production"
    ],
    "buyers": [
      "PACK厂",
      "电池Tier 1"
    ],
    "specifiers": [
      "PACK工程",
      "碰撞与热管理"
    ],
    "modes": [
      "定点直销"
    ],
    "partners": [
      "结构与密封服务商"
    ]
  },
  "recycling": {
    "routes": [
      "channel",
      "project"
    ],
    "buyers": [
      "回收企业",
      "再制造企业",
      "电池厂"
    ],
    "specifiers": [
      "EHS",
      "可持续发展"
    ],
    "modes": [
      "项目合作",
      "区域代理"
    ],
    "partners": [
      "逆向物流商",
      "合规服务商"
    ]
  },
  "motor": {
    "routes": [
      "production"
    ],
    "buyers": [
      "电驱Tier 1",
      "电机厂",
      "OEM三电平台"
    ],
    "specifiers": [
      "电驱研发",
      "NVH与质量"
    ],
    "modes": [
      "定点直销"
    ],
    "partners": [
      "测试与加工服务商"
    ]
  },
  "inverter": {
    "routes": [
      "production"
    ],
    "buyers": [
      "电驱Tier 1",
      "逆变器厂"
    ],
    "specifiers": [
      "电控研发",
      "功能安全"
    ],
    "modes": [
      "定点直销",
      "联合开发"
    ],
    "partners": [
      "FAE",
      "测试验证伙伴"
    ]
  },
  "power-semi": {
    "routes": [
      "production",
      "channel"
    ],
    "buyers": [
      "电控Tier 1",
      "功率模块厂",
      "分销商"
    ],
    "specifiers": [
      "电子架构",
      "硬件研发"
    ],
    "modes": [
      "直销",
      "授权分销"
    ],
    "partners": [
      "芯片分销商",
      "FAE"
    ]
  },
  "charging": {
    "routes": [
      "project",
      "channel"
    ],
    "buyers": [
      "CPO",
      "车队",
      "能源服务商"
    ],
    "specifiers": [
      "能源平台主管",
      "运维团队"
    ],
    "modes": [
      "项目销售",
      "区域代理"
    ],
    "partners": [
      "EPC",
      "系统集成商"
    ]
  },
  "hv": {
    "routes": [
      "production"
    ],
    "buyers": [
      "线束厂",
      "PACK厂",
      "电驱Tier 1"
    ],
    "specifiers": [
      "三电研发",
      "功能安全"
    ],
    "modes": [
      "量产直销"
    ],
    "partners": [
      "FAE",
      "可靠性实验室"
    ]
  },
  "smart": {
    "routes": [
      "production",
      "project"
    ],
    "buyers": [
      "智能驾驶Tier 1",
      "座舱Tier 1",
      "OEM"
    ],
    "specifiers": [
      "电子架构",
      "软件与算法团队"
    ],
    "modes": [
      "方案直销",
      "联合项目"
    ],
    "partners": [
      "系统集成商",
      "软件伙伴"
    ]
  },
  "software": {
    "routes": [
      "project"
    ],
    "buyers": [
      "OEM",
      "Tier 1",
      "车队与物流商"
    ],
    "specifiers": [
      "数字化负责人",
      "软件架构团队"
    ],
    "modes": [
      "项目销售",
      "订阅服务"
    ],
    "partners": [
      "实施商",
      "咨询与合规伙伴"
    ]
  },
  "quality": {
    "routes": [
      "project"
    ],
    "buyers": [
      "OEM质量部门",
      "Tier 1质量部门"
    ],
    "specifiers": [
      "法规认证",
      "质量工程"
    ],
    "modes": [
      "项目服务"
    ],
    "partners": [
      "检测认证机构"
    ]
  },
  "factory": {
    "routes": [
      "project"
    ],
    "buyers": [
      "OEM工厂",
      "Tier 1工厂"
    ],
    "specifiers": [
      "制造工程",
      "工厂物流"
    ],
    "modes": [
      "项目销售"
    ],
    "partners": [
      "自动化集成商",
      "设备代理商"
    ]
  },
  "risk": {
    "routes": [
      "project"
    ],
    "buyers": [
      "采购负责人",
      "供应链负责人"
    ],
    "specifiers": [
      "供应链风险团队",
      "质量与制造"
    ],
    "modes": [
      "项目服务",
      "战略合作"
    ],
    "partners": [
      "本地化服务商",
      "风险与合规顾问"
    ]
  },
  "trade": {
    "routes": [
      "project"
    ],
    "buyers": [
      "出口型零部件厂",
      "OEM供应链部门"
    ],
    "specifiers": [
      "合规法务",
      "采购与质量"
    ],
    "modes": [
      "专业服务"
    ],
    "partners": [
      "认证机构",
      "报关与律所"
    ]
  },
  "aftermarket": {
    "routes": [
      "channel"
    ],
    "buyers": [
      "进口商",
      "总代",
      "维修连锁",
      "车队"
    ],
    "specifiers": [
      "售后采购",
      "技术服务"
    ],
    "modes": [
      "总代分销",
      "区域经销"
    ],
    "partners": [
      "区域分销商",
      "仓储物流商"
    ]
  }
};

export function getSalesRouteProducts(routeId) {
  return Object.entries(SALES_RULES).filter(([, rule]) => rule.routes.includes(routeId)).map(([assemblyId]) => assemblyId);
}

export function getSalesRule(assemblyId) {
  return SALES_RULES[assemblyId];
}
