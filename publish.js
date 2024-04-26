const { execSync } = require('child_process');
const fs = require('fs');

// 执行构建命令
execSync('npm run build');

// 读取package.json文件
const packageJson = JSON.parse(fs.readFileSync('package.json'));

// 增加版本号
const version = packageJson.version.split('.');
version[2] = parseInt(version[2]) + 1;
packageJson.version = version.join('.');

// 更新package.json文件
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// 发布到npm
execSync('npm publish');

// 提交到GitHub
execSync('git add .');
execSync('git commit -m "Release version ' + packageJson.version + '"');
execSync('git push');