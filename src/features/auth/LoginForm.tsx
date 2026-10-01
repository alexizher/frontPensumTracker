import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface Props {
  onSubmit: (username: string, password: string) => void;
  loading: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, loading, error }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowPassword(false);
    onSubmit(username, password);
  }

  return (
    <>
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
            <Input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="tu.usuario"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Contraseña</label>
            <PasswordInput
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              revealed={showPassword}
              onRevealedChange={setShowPassword}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full"
          >
            {loading ? "Cargando pensum..." : "Ver mi pensum"}
          </Button>
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
      {error ? (
        <p className="text-destructive text-sm text-center mt-2">{error}</p>
      ) : null}
    </>
  );
}
