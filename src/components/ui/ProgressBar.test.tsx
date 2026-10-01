import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

function fillWidth(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[style]')?.style.width
}

describe('ProgressBar', () => {
  it('llena la barra según el porcentaje', () => {
    expect(fillWidth(render(<ProgressBar percent={50} />).container)).toBe('50%')
    expect(fillWidth(render(<ProgressBar percent={0} />).container)).toBe('0%')
    expect(fillWidth(render(<ProgressBar percent={100} />).container)).toBe('100%')
  })
})
