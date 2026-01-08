/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

// cukup sekali, regex cover semua extension image
declare module '*.{jpg,jpeg,png,svg,gif,webp}' {
  const src: string
  export default src
}
