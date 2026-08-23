import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { cambiarRolUsuario, eliminarUsuario } from "@/app/actions/user-actions"

export default async function GestionUsuariosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Validar rol de administrador
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (currentProfile?.role !== "administrador") {
    redirect("/dashboard")
  }

  // Obtener todos los usuarios
  const { data: usuarios } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Gestión Global de Usuarios</h1>
      <div className="space-y-4">
        {usuarios?.map((u) => (
          <div key={u.id} className="p-4 border rounded-lg flex items-center justify-between bg-slate-900 border-slate-800">
            <div>
              <p className="font-semibold text-white">{u.full_name || "Sin nombre"}</p>
              <p className="text-xs text-slate-400">ID: {u.id}</p>
              <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">
                Rol actual: <strong>{u.role}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <form action={async (formData) => {
                "use server"
                const nuevoRol = formData.get("role") as string
                await cambiarRolUsuario(u.id, nuevoRol)
              }}>
                <select 
                  name="role" 
                  defaultValue={u.role}
                  className="bg-slate-800 text-white px-2 py-1 rounded text-sm border border-slate-700"
                >
                  <option value="aprendiz">Aprendiz</option>
                  <option value="mentor">Mentor</option>
                  <option value="administrador">Administrador</option>
                </select>
                <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500">
                  Guardar
                </button>
              </form>

              <form action={async () => {
                "use server"
                await eliminarUsuario(u.id)
              }}>
                <button type="submit" className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/40 rounded text-sm hover:bg-red-600 hover:text-white">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}