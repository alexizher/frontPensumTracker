import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './Input'

interface Props extends Omit<ComponentProps<'input'>, 'type'> {
  // Con `revealed` definido el componente es controlado: no guarda estado propio
  // y solo avisa por onRevealedChange. No se debe alternar entre los dos modos.
  revealed?: boolean
  onRevealedChange?: (revealed: boolean) => void
}

export function PasswordInput({
  revealed,
  onRevealedChange,
  disabled,
  className,
  ...props
}: Props) {
  const [internalRevealed, setInternalRevealed] = useState(false)
  const controlled = revealed !== undefined
  const shown = controlled ? revealed : internalRevealed

  function toggle() {
    if (!controlled) setInternalRevealed(!shown)
    onRevealedChange?.(!shown)
  }

  return (
    <div className="relative">
      <Input
        disabled={disabled}
        // pr-10 va al final para que ningún relleno externo tape el hueco del ojo.
        className={cn(className, 'pr-10')}
        {...props}
        type={shown ? 'text' : 'password'}
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
