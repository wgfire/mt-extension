export type XMLHttpRequestOnly = Omit<
  XMLHttpRequest,
  'DONE',
  'HEADERS_RECEIVED',
  'LOADING',
  'OPENED',
  'UNSENT',
  'readyState',
  'responseText',
  'responseURL'
>
