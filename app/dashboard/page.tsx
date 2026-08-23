import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { responderSolicitud, cancelarSolicitud } from "@/app/actions/mentoria-actions"

// Interfaces explícitas para eliminar el uso de 'any'
interface Profile {
  id: string
  full_name: string | null
  role: string | null
}

interface Mentoria {
  id: string
  titulo: string
  descripcion: string
  mentor_id: string
  created_at: string
}

interface Solicitud {
  id: string
  mentoria_id: string
  aprendiz_id: string
  mensaje_motivacion: string
  estado: string
  created_at: string
  mentorias?: {
    titulo: string
    profiles?: {
      full_name: string | null
    } | null
  } | null
  profiles?: {
    full_name: string | null
  } | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verificar usuario autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Obtener información del perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>()

  const role = profile?.role || "aprendiz"

  // Variables tipadas para almacenar datos según el rol
  let misMentorias: Mentoria[] = []
  let solicitudesRecibidas: Solicitud[] = []
  let misSolicitudesEnviadas: Solicitud[] = []
  let totalMentorias = 0
  let totalSolicitudes = 0

  // 3. Cargar datos según el rol del usuario
  if (role === "mentor") {
    const mentoriasPromise = supabase
      .from("mentorias")
      .select("*")
      .eq("mentor_id", user.id)
      .order("created_at", { ascending: false })

    const solicitudesQuery = supabase
      .from("solicitudes")
      .select(`
        *,
        mentorias:mentoria_id!inner (titulo, mentor_id),
        profiles:aprendiz_id (full_name)
      `)
      .eq("mentorias.mentor_id", user.id)

    const [mentoriasRes, solicitudesRes] = await Promise.all([
      mentoriasPromise,
      solicitudesQuery
    ])

    misMentorias = (mentoriasRes.data as Mentoria[]) || []
    solicitudesRecibidas = (solicitudesRes.data as unknown as Solicitud[]) || []
  } 
  else if (role === "administrador") {
    const totalMentoriasRes = await supabase.from("mentorias").select("*", { count: "exact", head: true })
    const totalSolicitudesRes = await supabase.from("solicitudes").select("*", { count: "exact", head: true })

    totalMentorias = totalMentoriasRes.count || 0
    totalSolicitudes = totalSolicitudesRes.count || 0
  } 
  else {
    // Rol: Aprendiz
    const { data: solicitudes } = await supabase
      .from("solicitudes")
      .select(`
        *,
        mentorias (
          titulo,
          profiles:mentor_id (full_name)
        )
      `)
      .eq("aprendiz_id", user.id)
      .order("created_at", { ascending: false })

    misSolicitudesEnviadas = (solicitudes as unknown as Solicitud[]) || []
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white space-y-8">
      {/* Saludo principal */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hola, {profile?.full_name || "Usuario"}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Rol asignado: <span className="font-semibold text-indigo-400 uppercase">{role}</span>
          </p>
        </div>
        {role === "mentor" && (
          <a
            href="/dashboard/nueva-mentoria"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors text-sm"
          >
            + Crear Nueva Mentoría
          </a>
        )}
      </div>

      {/* VISTA PARA MENTOR */}
      {role === "mentor" && (
        <>
          <section>
            <h2 className="text-xl font-bold mb-4">Mis Mentorías Publicadas</h2>
            {misMentorias.length === 0 ? (
              <p className="text-slate-400 text-sm">No has publicado mentorías aún.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {misMentorias.map((m) => (
                  <div key={m.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="font-semibold text-lg">{m.titulo}</h3>
                    <p className="text-sm text-slate-400 mt-1">{m.descripcion}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Solicitudes de Aprendices Recibidas</h2>
            {solicitudesRecibidas.length === 0 ? (
              <p className="text-slate-400 text-sm">No hay solicitudes pendientes por el momento.</p>
            ) : (
              <div className="space-y-3">
                {solicitudesRecibidas.map((sol) => (
                  <div key={sol.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-semibold">
                        {sol.estado}
                      </span>
                      <h3 className="font-semibold mt-1">{sol.mentorias?.titulo}</h3>
                      <p className="text-sm text-slate-400">Aprendiz: {sol.profiles?.full_name}</p>
                      <p className="text-xs text-slate-500 italic mt-1">"{sol.mensaje_motivacion}"</p>
                    </div>

                    <div className="flex gap-2">
                      <form action={async () => {
                        "use server"
                        await responderSolicitud(sol.id, "aceptada")
                      }}>
                        <button type="submit" className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium">
                          Aceptar
                        </button>
                      </form>
                      <form action={async () => {
                        "use server"
                        await responderSolicitud(sol.id, "rechazada")
                      }}>
                        <button type="submit" className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600 hover:text-white rounded text-sm transition-colors">
                          Rechazar
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* VISTA PARA APRENDIZ */}
      {role === "aprendiz" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Mis Solicitudes Enviadas</h2>
          {misSolicitudesEnviadas.length === 0 ? (
            <p className="text-slate-400 text-sm">No te has postulado a ninguna mentoría aún.</p>
          ) : (
            <div className="space-y-4">
              {misSolicitudesEnviadas.map((sol) => (
                <div key={sol.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-semibold border ${
                      sol.estado === 'aceptada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      sol.estado === 'rechazada' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {sol.estado}
                    </span>
                    <h3 className="font-semibold text-lg mt-1">{sol.mentorias?.titulo}</h3>
                    <p className="text-sm text-slate-400">Mentor: {sol.mentorias?.profiles?.full_name}</p>
                    <p className="text-xs text-slate-500 italic mt-1">"{sol.mensaje_motivacion}"</p>
                  </div>

                  <div>
                    <form action={async () => {
                      "use server"
                      await cancelarSolicitud(sol.id)
                    }}>
                      <button 
                        type="submit" 
                        className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/40 rounded text-sm hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Cancelar Solicitud
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VISTA PARA ADMINISTRADOR */}
      {role === "administrador" && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold">Resumen Global de Plataforma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <p className="text-xs uppercase font-semibold text-slate-400">Total Mentorías</p>
              <p className="text-4xl font-extrabold text-indigo-400 mt-2">{totalMentorias}</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <p className="text-xs uppercase font-semibold text-slate-400">Total Solicitudes</p>
              <p className="text-4xl font-extrabold text-emerald-400 mt-2">{totalSolicitudes}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="/dashboard/usuarios"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Manage Users →
            </a>
          </div>
        </section>
      )}
    </div>
  )
}