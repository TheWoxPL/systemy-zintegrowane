import { BOM, GHP } from './data.mjs';

const calculateGHP = (GHP, BOM) => {
  GHP.stock = BOM.find((item) => item.level === 0).stock;
  GHP.realization_time = BOM.find((item) => item.level === 0).realization_time;
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
  for (let i = 0; i < item.schedule.length; i++) {
    const realization_time = item.level === 1 ? parent.realization_time : 0;
    // Assign values to shcedule if other than 0, edge case
    if (parent.schedule[i] != 0) {
      if (i < parent.realization_time) {
        console.log('Edge Case');
      }
      item.schedule[i - realization_time].totalDemand =
        parent.schedule[i] * item.required;
    }
  }
  for (let i = 0; i < item.schedule.length; i++) {
    if (i === 0) {
      item.schedule[i].estimatedStock = item.stock;
      let calculatedStock =
        item.schedule[i].estimatedStock - item.schedule[i].totalDemand;
      if (calculatedStock < 0) {
        item.schedule[i].plannedParties = calculatedStock * -1;
        item.schedule[i].estimatedStock = 0;
      }
    } else {
      let calculatedStock =
        item.schedule[i - 1].estimatedStock -
        item.schedule[i].totalDemand +
        item.schedule[i].plannedReceiptOfOrders +
        item.schedule[i].plannedParties;
      if (calculatedStock < 0) {
        const netDemand = calculatedStock * -1;
        console.log('Negative stock');
        item.schedule[i].netDemand = netDemand;
        item.schedule[i - item.realization_time].plannedOrders = item.partSize;
        item.schedule[i].plannedReceiptOfOrders = item.partSize;
        calculatedStock =
          item.schedule[i].plannedReceiptOfOrders +
          item.schedule[i - 1].estimatedStock -
          item.schedule[i].totalDemand;
      }
      item.schedule[i].estimatedStock = calculatedStock;
    }
  }
  return { ...item };
};

const calculateMRP = (GHP, BOM) => {
  const maxLevel = Math.max(...BOM.map((item) => item.level));
  const MRP = BOM.map((item) => ({
    // TODO: change filling if load data from website
    ...item,
    schedule: Array.from({ length: GHP.schedule.length }, (_, i) => {
      return {
        week: i + 1,
        totalDemand: 0,
        plannedParties: 0,
        estimatedStock: 0,
        netDemand: 0,
        plannedOrders: 0,
        plannedReceiptOfOrders: 0,
      };
    }),
  }));

  for (let i = 0; i <= maxLevel; i++) {
    for (let j = 0; j < MRP.length; j++) {
      // 0 level BOM part, fill up schedule from GHP
      if (MRP[j].level === i) {
        if (i === 0) {
          MRP[j] = { ...MRP[j], schedule: GHP.schedule };
          break;
        }

        const parent = MRP.find((item) => item.name === MRP[j].parent);

        // If level 1 BOM part, send production part from parent schedule and realization time
        if (i === 1) {
          console.log('1');
          MRP[j] = calculateItem(MRP[j], {
            schedule: parent.schedule.map((item) => item.production),
            realization_time: parent.realization_time,
          });
        }
        if (i === 2) {
          console.log('2');
          MRP[j] = calculateItem(MRP[j], {
            schedule: parent.schedule.map((item) => item.plannedOrders),
            realization_time: parent.realization_time,
          });
        }
      }
    }
  }

  return MRP;
};

// console.log(calculateGHP(GHP, BOM));
// console.log(calculateMRP(GHP, BOM));

calculateGHP(GHP, BOM);
const data = calculateMRP(GHP, BOM);

const generateTables = (data) => {
  const tableContainer = document.querySelector('#table-container'); // Corrected selector

  data.forEach((item) => {
    // Create a table for each item
    const table = document.createElement('table');
    table.border = '1';
    table.style.marginBottom = '20px';

    // Add a caption with the item's name
    const caption = document.createElement('caption');
    caption.textContent = `Item: ${item.name} (Level: ${item.level})`;
    table.appendChild(caption);

    // Create the header row
    const headerRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Property';
    headerRow.appendChild(th);

    item.schedule.forEach((week) => {
      const th = document.createElement('th');
      th.textContent = `Week ${week.week}`;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add rows for each property
    const properties = Object.keys(item.schedule[0]).filter((key) => key !== 'week');
    properties.forEach((property) => {
      const row = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = property;
      row.appendChild(td);

      item.schedule.forEach((week) => {
        const td = document.createElement('td');
        td.textContent = week[property];
        row.appendChild(td);
      });

      table.appendChild(row);
    });

    // Append the table to the container
    tableContainer.appendChild(table);
  });
};

// Call the function to generate tables
generateTables(data);