class Message {
  private msgHandel: Record<string, Array<any>>
  constructor() {
    this.msgHandel = {}
  }

  sendMessage(nameId: string, data: any) {
    chrome.runtime.sendMessage({ nameId, data })
  }

  onmessage(nameId: string, callback: (data: any) => void) {
    chrome.runtime.onMessage.addListener((message) => {
      callback(message)
    })
  }
}

export default Message
