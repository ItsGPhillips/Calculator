import 'styled-components'

declare module 'styled-components' {
   export interface DefaultTheme {
      colors: {
         primary: string
         secondary: string
      }
   }
}
declare module "react" {
   interface HTMLAttributes<T> {
      css?: any,
   }
}
declare module "*.mp3" {
   const content: string;
   export default content;
}