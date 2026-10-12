import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (media) => ({
    matches: false,
    media,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  }),
})

if (!globalThis.crypto.randomUUID) {
  let nextId = 0
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    configurable: true,
    value: () => `test-todo-${++nextId}`,
  })
}
