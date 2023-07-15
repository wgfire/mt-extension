declare module '*.vue' {
  const component: any
  export default component
}

declare interface  XMLHttpRequests extends XMLHttpRequest {
  [key: string]: any
}