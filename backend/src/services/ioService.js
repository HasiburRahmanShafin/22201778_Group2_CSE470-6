let ioInstance = null;

function setIo(io) {
  ioInstance = io;
}

function getIo() {
  if (!ioInstance) {
    console.warn('⚠️ getIo() called before io was set');
  }
  return ioInstance;
}

module.exports = { setIo, getIo };