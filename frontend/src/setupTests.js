import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

globalThis.jest = vi

if (!window.matchMedia) {
	window.matchMedia = () => ({
		matches: false,
		media: '',
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	})
}

if (!window.ResizeObserver) {
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
}

const originalGetComputedStyle = window.getComputedStyle?.bind(window)

if (originalGetComputedStyle) {
	window.getComputedStyle = (element) => originalGetComputedStyle(element)
}