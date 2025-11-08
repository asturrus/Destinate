import '@testing-library/jest-dom'
import { server } from './client/src/mocks/server'

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset handlers after each test to ensure test isolation
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())