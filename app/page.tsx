import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import GithubMentors from "@/app/components/GithubMentors";

export default async function Home() {
  // Se agrega 'await' para obtener la instancia del cliente de Supabase
  const supabase = await createClient();

  // Consulta de mentorías activas desde Supabase
  const { data: mentorias, error } = await supabase
    .from("mentorias")
    .select("*, profiles:mentor_id(full_name, avatar_url)")
    .eq("estado", "activa")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando mentorías:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Seccion Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Aprende Código e Idiomas con{" "}
            <span className="text-blue-500">Mentores Expertos</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Conecta con instructores calificados, postula a sesiones personalizadas
            y potencia tus habilidades técnicas.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Comenzar Ahora
            </Link>
            <Link
              href="#mentorias"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-6 py-3 rounded-lg border border-slate-700 transition-colors"
            >
              Explorar Mentorías
            </Link>
          </div>
        </section>

        {/* COMPONENTE DE API REST EXTERNA (Consumo vía fetch + async/await) */}
        <GithubMentors />

        {/* Sección de Mentorías Recientes (Supabase DB) */}
        <section id="mentorias" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Mentorías Recientes</h2>
            <p className="text-sm text-slate-400">
              Explora las últimas ofertas publicadas por nuestra comunidad.
            </p>
          </div>

          {!mentorias || mentorias.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              No hay mentorías activas en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentorias.map((m) => (
                <div
                  key={m.id}
                  className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                      {m.idioma_o_tecnologia}
                    </span>
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
        </section>
      </div>
    </main>
  );
}