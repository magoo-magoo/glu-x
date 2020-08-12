
const random = new Phaser.RandomDataGenerator([Date.now()]);

export const randomInteger = (a: number, b: number) =>
  random.integerInRange(a, b);

export const randomBoolean = () => randomInteger(0, 1) === 1;
