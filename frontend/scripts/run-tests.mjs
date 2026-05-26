import { spawn } from 'node:child_process'

const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== '--runInBand')
const vitestArgs = ['run', ...forwardedArgs]

const child = spawn('npx', ['vitest', ...vitestArgs], {
  stdio: 'inherit',
  shell: true,
})

child.on('exit', (code) => {
  process.exit(code ?? 1)
})