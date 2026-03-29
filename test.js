import cp from 'child_process';
import fs from 'fs';
try {
  const result = cp.execSync('npm run build', { encoding: 'utf-8' });
  fs.writeFileSync('error.txt', result);
} catch (e) {
  fs.writeFileSync('error.txt', (e.stdout || '') + '\n' + (e.stderr || '') + '\n' + e.message);
}
