const path = require('path');
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

export default defineConfig({
    resolve:{
        alias :{
                'comps' : resolve(__dirname ,'src/components'),
                'directives' : resolve(__dirname ,'src/directives'),
                'style' : resolve(__dirname ,'src/style'),
                'theme' : resolve(__dirname,'src/style/theme/dark'),
                'utils' : resolve(__dirname ,'src/utils'),
                'json' : resolve(__dirname ,'src/json'),
                'demo' : resolve(__dirname ,'src/demo')
              }
    },
    plugins : [
                vue(),
              ],
    server: {
                // 配置服务器
                hmr: {
                  overlay: false
                }
            },
    build: {
              lib: {
                entry: path.resolve(__dirname, 'xmv-entry.js'),
                name: 'XmvUI'
              },
              cssCodeSplit:true,
              rollupOptions: {
                // 请确保外部化那些你的库中不需要的依赖
                external: ['vue'],
                output: {
                  // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                  globals: {
                    vue: 'Vue'
                  }
                }
              },
              sourcemap: true
    }
})