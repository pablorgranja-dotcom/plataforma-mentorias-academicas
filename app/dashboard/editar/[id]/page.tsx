import { createClient } from "@/lib/supabase-server"
import { actualizarMentoria } from "@/app/actions/mentoria-actions"
import { redirect } from "next/navigation"

export default async function EditarMentoriaPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    // Obtener la mentoría a editar
    const { data: mentoria } = await supabase
        .from("mentorias")
        .select("*")
        .eq("id", params.id)
        .single()

    // Si no existe o no le pertenece al mentor actual, redirigir
    if (!mentoria || mentoria.mentor_id !== user.id) {
        redirect("/dashboard")
    }

    const actualizarConId = actualizarMentoria.bind(null, mentoria.id)

    return (
        <main className="max-w-xl mx-auto px-6 py-12">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
                <h1 className="text-2xl font-bold text-white">Editar Mentoría</h1>

                <form action={actualizarConId} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Título</label>
                        <input
                            type="text"
                            name="titulo"
                            defaultValue={mentoria.titulo}
                            required
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Tecnología / Idioma</label>
                        <input
                            type="text"
                            name="idioma_o_tecnologia"
                            defaultValue={mentoria.idioma_o_tecnologia}
                            required
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            defaultValue={mentoria.descripcion}
                            rows={4}
                            required
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}