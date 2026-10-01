import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './Input'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  // Con `visible` definido el componente es controlado y solo avisa por onVisibleChange.
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
}

export function PasswordInput({ visible, onVisibleChange, disabled, className, ...props }: Props) {
  const [internalVisible, setInternalVisible] = useState(false)
  const shown = visible ?? internalVisible

  function toggle() {
    if (visible === undefined) setInternalVisible(!shown)
    onVisibleChange?.(!shown)
  }

  return (
    <div className="relative">
      <Input
        type={shown ? 'text' : 'password'}
        disabled={disabled}
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={shown}
        className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50"
      >
        {shown ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
