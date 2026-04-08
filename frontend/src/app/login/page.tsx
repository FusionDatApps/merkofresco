"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth";
import { getToken } from "@/lib/storage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 useEffect(() => {
  const token = getToken();
  if (token) {
    // opcional: podrías validar con getMe aquí en el futuro
    // por ahora lo dejamos suave
    console.log("Token detectado");
  }
}, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      window.location.replace("/dashboard");
      return;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Iniciar sesión
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa con tu cuenta para acceder al panel de MerKofresco.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2.5 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-black font-medium underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </main>
  );
}