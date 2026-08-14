import * as migration_20260814_060100 from './20260814_060100';

export const migrations = [
  {
    up: migration_20260814_060100.up,
    down: migration_20260814_060100.down,
    name: '20260814_060100'
  },
];
