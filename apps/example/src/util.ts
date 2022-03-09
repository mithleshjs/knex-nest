import chalk = require('chalk');

export function printQueryTime(title: string, start: number, end: number) {
  console.log(
    chalk.yellow(`[${title}] `) +
      chalk.green(`${new Date().toLocaleString()}`) +
      chalk.yellow(` +${end - start} ms`)
  );
}
