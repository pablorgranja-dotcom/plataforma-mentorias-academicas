import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { actualizarPerfil } from "@/app/actions/user-actions"

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <form action={actualizarPerfil} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Nombre Completo
          </label>
          <input
            type="text"
            name="full_name"
            defaultValue={profile?.full_name || ""}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rol Asignado
          </label>
          <input
            type="text"
            value={profile?.role || "aprendiz"}
            disabled
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed uppercase text-sm font-semibold"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}