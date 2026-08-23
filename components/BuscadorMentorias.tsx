'use client'

import { useState } from "react"
import Link from "next/link"

interface Mentoria {
  id: string
  titulo: string
  descripcion: string
  idioma_o_tecnologia?: string
  profiles?: {
    full_name: string
  }
}

export default function BuscadorMentorias({ mentorias }: { mentorias: Mentoria[] }) {
  const [busqueda, setBusqueda] = useState("")

  const mentoriasFiltradas = mentorias.filter((m) =>
    m.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.idioma_o_tecnologia?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Contenedor del buscador con ícono de lupa */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar mentoría por título, descripción o tecnología..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
        />
      </div>

      {/* Grid de mentorías filtradas */}
      {mentoriasFiltradas.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
          No se encontraron mentorías que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentoriasFiltradas.map((m) => (
            <div
              key={m.id}
              className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                {m.idioma_o_tecnologia && (
                  <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                    {m.idioma_o_tecnologia}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white">{m.titulo}</h3>
                <p className="text-slate-400 text-sm line-clamp-3">
                  {m.descripcion}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Por: {m.profiles?.full_name || "Mentor Institucional"}
                </span>
                <Link
                  href={`/mentorias/${m.id}`}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Ver detalle &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}