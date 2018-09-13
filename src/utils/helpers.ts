export const randomInteger = (a: number, b: number) =>
  Number.parseInt(Phaser.Math.random(a, b).toFixed(0));

export const randomBoolean = () => randomInteger(0, 1) === 1;
