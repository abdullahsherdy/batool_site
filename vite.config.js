import {defineConfig} from 'vite';
export default defineConfig({
  base: './',
  build: {rollupOptions: {input: ['index.html','first_task.html','second_task.html','third_task.html','fourth_task.html','decisions.html','sixth_task.html']}}
});
