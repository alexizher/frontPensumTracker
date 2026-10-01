import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { installMatchMedia } from './match-media'

beforeEach(() => {
  installMatchMedia()
})

afterEach(() => {
  cleanup()
})
