import chokidar from 'chokidar';
import { join } from 'node:path';
import { exec } from 'child_process';

const watchPath = join(process.cwd(), '..', 'packages');

chokidar.watch(watchPath, {
    ignored: /node_modules/,
    ignoreInitial: true
}).on('all', (event, path) => {
    const dir = watchPath + path.replace(watchPath, '').split(/[\\/]/)[1]
    exec('yarn build', { cwd: dir});
});