'use server'

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- ACCIONES DE MENTORÍAS ---

export async function crearMentoria(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string
  const categoria_id = formData.get("categoria_id") as string

  const { error } = await supabase
    .from("mentorias")
    .insert([
      {
        titulo,
        descripcion,
        categoria_id,
        mentor_id: user.id,
      },
    ])

  if (error) {
    throw new Error("Error al crear la mentoría: " + error.message)
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function editarMentoria(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const id = formData.get("id") as string
  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string

  const { error } = await supabase
    .from("mentorias")
    .update({ titulo, descripcion })
    .eq("id", id)
    .eq("mentor_id", user.id)

  if (error) {
    throw new Error("Error al actualizar la mentoría: " + error.message)
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function eliminarMentoria(mentoriaId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { error } = await supabase
    .from("mentorias")
    .delete()
    .eq("id", mentoriaId)
    .eq("mentor_id", user.id)

  if (error) {
    throw new Error("Error al eliminar la mentoría: " + error.message)
  }

  revalidatePath("/dashboard")
}

// --- ACCIONES DE SOLICITUDES ---

export async function responderSolicitud(solicitudId: string, nuevoEstado: "aceptada" | "rechazada") {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { error } = await supabase
    .from("solicitudes")
    .update({ estado: nuevoEstado })
    .eq("id", solicitudId)

  if (error) {
    throw new Error("Error al actualizar la solicitud: " + error.message)
  }

  revalidatePath("/dashboard")
}

export async function cancelarSolicitud(solicitudId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  // Elimina la solicitud asegurando que pertenezca al aprendiz actual
  const { error } = await supabase
    .from("solicitudes")
    .delete()
    .eq("id", solicitudId)
    .eq("aprendiz_id", user.id)

  if (error) {
    throw new Error("Error al cancelar la solicitud: " + error.message)
  }

  revalidatePath("/dashboard")
}