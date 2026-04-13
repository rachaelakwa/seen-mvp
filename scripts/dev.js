import { spawn } from 'node:child_process';

const processes = [
  {
    name: 'backend',
    command: 'npm',
    args: ['run', 'dev'],
    cwd: new URL('../backend/', import.meta.url),
  },
  {
    name: 'frontend',
    command: 'npm',
    args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5174', '--strictPort'],
    cwd: new URL('../frontend/', import.meta.url),
  },
];

const children = processes.map(({ name, command, args, cwd }) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal !== 'SIGTERM') {
      console.error(`[${name}] exited with code ${code ?? signal}`);
    }
  });

  return child;
});

function shutdown() {
  children.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });
}

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(0);
});
