// export const BON = {
//   // name: 'Rower',
//   // level: 0,
//   // items: [
//   //   {
//   //     name: 'Koło',
//   //     level: 1,
//   //     required: 2,
//   //     items: [
//   //       { name: 'Szprycha', level: 2, required: 32, items: [] },
//   //       { name: 'Opona', level: 2, required: 1, items: [] },
//   //     ],
//   //   },
//   //   {
//   //     name: 'Rama',
//   //     level: 1,
//   //     items: [
//   //       { name: 'Kierownica', level: 2, required: 1, items: [] },
//   //       { name: 'Siodło', level: 2, required: 1, items: [] },
//   //       { name: 'Hamulec', level: 2, required: 2, items: [] },
//   //       { name: 'Pedał', level: 2, required: 2, items: [] },
//   //     ],
//   //   },
//   //   { name: 'Łańcuch', level: 1, required: 1, items: [] },
//   // ],
//   name: 'Stół',
//   level: 0,
//   maxLevel: 2,
//   required: 1,
//   parent: null,
//   realization_time: 0,
// };

export const BON = [
  {
    name: 'Stół',
    level: 0,
    required: 1,
    parent: null,
    realization_time: 1,
    stock: 2,
  },
  {
    name: 'Noga',
    level: 1,
    required: 1,
    parent: 'Stół',
    realization_time: 2,
    stock: 40,
    partSize: 120, 
  },
  {
    name: 'Blat',
    level: 1,
    required: 1,
    parent: 'Stół',
    realization_time: 3,
    stock: 22,
    partSize: 40, 
  },
  {
    name: 'Płyta',
    level: 2,
    required: 1,
    parent: 'Blat',
    realization_time: 1,
    stock: 10,
    partSize: 50, 
  },
];

export let GHP = {
  schedule: [
    { week: 1, demand: 0, production: 0, stock: 0 },
    { week: 2, demand: 0, production: 0, stock: 0 },
    { week: 3, demand: 0, production: 0, stock: 0 },
    { week: 4, demand: 0, production: 0, stock: 0 },
    { week: 5, demand: 20, production: 28, stock: 0 },
    { week: 6, demand: 0, production: 0, stock: 0 },
    { week: 7, demand: 40, production: 30, stock: 0 },
    { week: 8, demand: 0, production: 0, stock: 0 },
    { week: 9, demand: 0, production: 0, stock: 0 },
    { week: 10, demand: 0, production: 0, stock: 0 },
  ],
};
