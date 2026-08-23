'use server'

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

// --- ACCIONES DE ADMINISTRADOR ---

export async function cambiarRolUsuario(userId: string, nuevoRol: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "administrador") {
    throw new Error("No tienes permisos de administrador")
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: nuevoRol })
    .eq("id", userId)

  if (error) {
    throw new Error("Error al actualizar el rol: " + error.message)
  }

  revalidatePath("/dashboard/usuarios")
}

export async function eliminarUsuario(userId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "administrador") {
    throw new Error("No tienes permisos de administrador")
  }

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId)

  if (error) {
    throw new Error("Error al eliminar el usuario: " + error.message)
  }

  revalidatePath("/dashboard/usuarios")
}

// --- ACCIÓN DE PERFIL (CUALQUIER USUARIO) ---

export async function actualizarPerfil(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const fullName = formData.get("full_name") as string

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id)

  if (error) {
    throw new Error("Error al actualizar el perfil: " + error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/perfil")
}