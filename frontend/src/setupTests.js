import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for react-router v7 in jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
