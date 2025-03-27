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

const calculateItem = (item, parent) => {
  console.log(parent);
  for (let i = 0; i < item.schedule.length; i++) {
    // Assign values to shcedule if other than 0, edge case
    if (parent.schedule[i] != 0) {
      if (i < parent.realization_time) {
        console.log('Edge Case, implement later');
      }
      item.schedule[i - parent.realization_time].demand =
        parent.schedule[i] * item.required;
    }

    if (i === 0) {
      item.schedule[i].stock = item.stock;
    } else {
      const calculatedStock =
        item.schedule[i - 1].stock -
        item.schedule[i].demand +
        item.schedule[i].production;
      if(calculatedStock <0){
        console.log("Attention, negative stock");
      }
      item.schedule[i].stock = calculatedStock 
    }
  }
  return { ...item };
};

const calculateMRP = (GHP, BON) => {
  const maxLevel = Math.max(...BON.map((item) => item.level));
  const schedule = Array.from({ length: GHP.schedule.length }, (_, i) => {
    return { week: i + 1, demand: 0, production: 0, stock: 0 };
  });
  const MRP = BON.map((item) => ({ ...item, schedule: schedule }));

  for (let i = 0; i <= maxLevel; i++) {
    for (let j = 0; j < MRP.length; j++) {
      // 0 level BON part, fill up schedule from GHP
      if (MRP[j].level === i) {
        if (i === 0) {
          MRP[j] = { ...MRP[j], schedule: GHP.schedule };
          break;
        }

        const parent = MRP.find((item) => item.name === MRP[j].parent);

        // If level 1 BON part, send production part from parent schedule and realization time
        if (i === 1) {
          MRP[j] = calculateItem(MRP[j], {
            schedule: parent.schedule.map((item) => item.production),
            realization_time: parent.realization_time,
          });
        }
      }
    }
  }

  return MRP;
};

calculateGHP(GHP, BON);
// console.log(calculateGHP(GHP, BON));
console.log(calculateMRP(GHP, BON));
