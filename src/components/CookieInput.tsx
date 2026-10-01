import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  onSubmit: (username: string, password: string) => void;
  loading: boolean;
}

export function CookieInput({ onSubmit, loading }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowPassword(false);
    onSubmit(username, password);
  }

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="text-2xl text-center font-semibold mb-1">Cursum Pro</h1>
      <p className="text-muted-foreground text-center text-sm mb-6">
        Hecho por estudiantes, para estudiantes.
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        Ingresa con tus credenciales del portal universitario.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Usuario</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="tu.usuario"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={loading}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim() || !password.trim()}
          className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Cargando pensum..." : "Ver mi pensum"}
        </button>
      </form>
      <p className="text-muted-foreground text-sm mb-6">
        Esta app no almacena tu información personal. Los datos son procesados y
        deshechados al instante para mostrarte tu pensum. Si tienes dudas o
        quieres reportar alguna novedad, contáctanos en{" "}
        <a
          href="mailto:antony.arevalo@udea.edu.co"
          className="underline hover:text-foreground"
        >
          antony.arevalo@udea.edu.co
        </a>
      </p>
    </div>
  );
}
