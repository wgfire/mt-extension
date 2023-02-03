
class Message {
  document: Document
  constructor() {
    this.document = document
  }
  getMessage() {
    window.addEventListener('message', (e) => {
      console.log(e, '接受')
    })
  }
  triggerHandel(type: keyof this) {
    return this[type]
  }
  closePopup() {
    const mt = this.document.querySelector('.mt-iframe-large')
    mt?.classList.toggle('fade-in')
    mt?.classList.toggle('fade-out')
  }
}

const message = new Message()

message.getMessage()

// aa.offMEssage(['ccc', 'vvvv'])

// aa.postMessage({type, data})
