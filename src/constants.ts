import { RoleType, Faction, RoleData } from './types';

export const ROLES: Record<RoleType, RoleData> = {
  [RoleType.IMMUNE_CELL]: {
    id: RoleType.IMMUNE_CELL,
    name: '免疫细胞',
    faction: Faction.IMMUNE_SYSTEM,
    description: '好人阵营（1人），机体的哨兵。',
    bioConcept: '免疫监视：通过表面受体识别并清除病原体。',
    ability: '【治愈】：换座后，当你和病毒邻座，你将其治愈为体细胞。',
    victoryCondition: '清除场上所有活性病毒。',
    icon: 'Shield'
  },
  [RoleType.VIRUS]: {
    id: RoleType.VIRUS,
    name: '病毒',
    faction: Faction.VIRUS_HORDE,
    description: '坏人阵营（2人），擅长改写宿主。',
    bioConcept: '溶源周期：病毒将其遗传物质整合进宿主基因组。',
    ability: '【感染】：换座后，当你和体细胞邻座，你可以自主选择是否执行感染。',
    victoryCondition: '隐藏身份，使病毒数量扩散到总人数一半以上（即达到5人及以上）。',
    icon: 'Skull'
  },
  [RoleType.CIVILIAN_CELL]: {
    id: RoleType.CIVILIAN_CELL,
    name: '体细胞',
    faction: Faction.IMMUNE_SYSTEM,
    description: '好人阵营（5人），机体的基石。',
    bioConcept: '组织稳态：构成器官的基本单位。',
    ability: '【免疫记忆】：被治愈后获得一回合“免疫力”，无法被再次感染。',
    victoryCondition: '协助免疫细胞锁定病毒，并确保场上所有病毒被清除。',
    icon: 'Users'
  }
};

export const INITIAL_GREETING = "指挥官，战术指挥系统已离线同步。本地生物逻辑库已就绪，请输入关键词进行战术分析（例如：换座策略、病毒感染、获胜方法）。";

export const GAME_OVERVIEW = {
  title: "免疫战争：游戏流程介绍",
  summary: "《免疫战争》共有9人参与（8名玩家 + 1名上帝）。通过模拟细胞流转，让玩家直观理解公共卫生的防御逻辑。",
  mechanics: [
    {
      title: "阶段一：细胞迁移与免疫巡逻（换座阶段）",
      content: "• “指挥者”首轮随机，随后由玩家顺时针交替。\n• 指挥者提出换座方案，全员表决。\n• 若方案作废两次，则下一个指挥者的方案无需投票直接执行。"
    },
    {
      title: "阶段二：特异性识别与应答（感染/治愈阶段）",
      content: "• 座位调整后，根据新的同桌关系触发身份转换。\n• 免疫细胞与病毒同桌 -> 病毒被治愈为体细胞。\n• 病毒与体细胞同桌 -> 病毒可自主选择是否执行感染。"
    },
    {
      title: "阶段三：信息公布阶段",
      content: "• “上帝”公示当前场上的病毒总数，但不透露具体身份。"
    }
  ],
  sdgs: [
    {
      id: "SDG 3",
      title: "良好健康与福祉",
      desc: "具体关联：游戏通过模拟免疫过程，提升公众对疾病预防和免疫系统的认知，促进健康素养提升。"
    },
    {
      id: "SDG 4",
      title: "优质教育",
      desc: "具体关联：项目采用游戏化学习方法，将复杂的生物学概念转化为可交互的游戏体验。"
    },
    {
      id: "SDG 17",
      title: "促进目标实现的伙伴关系",
      desc: "具体关联：整合游戏设计、教育理论、生物医学和技术开发的专业知识。"
    }
  ]
};
