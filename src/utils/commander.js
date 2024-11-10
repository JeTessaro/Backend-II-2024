const { Command } = require('commander')

const program = new Command()

program
    .option('--mode <mode>', 'Especificar el entorno de ejecución de nuestro servidor', 'development')

program.parse()

module.exports = {
    program
}
