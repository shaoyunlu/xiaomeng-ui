import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import legacy from '@vitejs/plugin-legacy'


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
                legacy({
                    targets : ['firefox 43']
                }),
              ],
    server: {
                // 配置服务器
                hmr: {
                  overlay: false
                }
            }
})