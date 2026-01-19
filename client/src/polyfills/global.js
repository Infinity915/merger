// Polyfill to provide `global` in browser environment for some libraries
// (e.g. older sockjs-client builds expect `global` to exist)
if (typeof global === 'undefined' && typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    window.global = window;
}

export default {};
