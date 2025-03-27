import { BON, GHP } from './data.mjs';

const calculateGHP = (GHP, BON) => {
  GHP.stock = BON.find((item) => item.level === 0).stock;
  GHP.realization_time = BON.find((item) => item.level === 0).realization_time;
  for (let i = 0; i < GHP.schedule.length; i++) {
    if (i === 0) {
      GHP.schedule[i].stock =
        GHP.stock - GHP.schedule[i].demand + GHP.schedule[i].production;
    } else {
      GHP.schedule[i].stock =
        GHP.schedule[i - 1].stock -
        GHP.schedule[i].demand +
        GHP.schedule[i].production;
    }
  }
  return GHP;
};

const calculateItem = (item, parentSchedule) => {
  // console.log(item);
  // console.log(parentSchedule);
}

const calculateMRP = (GHP, BON) => {
  const maxLevel = Math.max(...BON.map((item) => item.level));
  const schedule = Array.from({ length: GHP.schedule.length }, (_, i) => {
    return { week: i + 1, demand: 0, production: 0, stock: 0 };
  });
  const MRP = BON.map((item) => ({ ...item, schedule: schedule }));

  for (let i = 0; i <= maxLevel; i++) {
    for (let j = 0; j < MRP.length; j++) {
      let item = MRP[j];
      if(item.level === 0) {
        item = {...item, schedule: GHP.schedule, asd: 'asd'};
        console.log(item);
        return;
      }
    }

    return;
      // const parentSchedule = MRP.find((parent) => parent.name === item.parent).schedule;
      // calculateItem(item, parentSchedule);

  }

  return MRP;
};

calculateGHP(GHP, BON);
// console.log(calculateGHP(GHP, BON));
console.log(calculateMRP(GHP, BON));
