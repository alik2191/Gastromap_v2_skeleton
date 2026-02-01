import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup()
})

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn(key => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

Object.defineProperty(window, 'ResizeObserver', {
    value: ResizeObserver,
});

// Mock IntersectionObserver
class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
}

Object.defineProperty(window, 'IntersectionObserver', {
    value: IntersectionObserver,
});

// Mock SubscriptionGate to bypass payment wall in tests
vi.mock('../components/auth/SubscriptionGate', () => ({
    default: ({ children }) => children
}))
