interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
}

export default async function GithubMentors() {
  // Lista de usuarios/mentores de GitHub para consultar la API pública
  const usernames = ['octocat', 'vercel', 'supabase'];
  
  let mentors: GithubUser[] = [];
  let errorMsg = '';

  try {
    // Consumo de API REST Externa con fetch + async/await (Server Component)
    const requests = usernames.map(async (user) => {
      const res = await fetch(`https://api.github.com/users/${user}`, {
        next: { revalidate: 3600 } // Caché eficiente en el servidor
      });
      
      if (!res.ok) throw new Error('Falló la respuesta de la API de GitHub');
      return res.json();
    });

    mentors = await Promise.all(requests);
  } catch (err) {
    // Manejo de errores si la API falla o no responde
    errorMsg = 'No se pudieron cargar los perfiles externos en este momento.';
  }

  return (
    <section className="my-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
      <h3 className="text-xl font-bold text-white mb-2">
        Comunidad & Referentes Tech (Vía GitHub API)
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Datos en tiempo real enriquecidos desde una API REST externa.
      </p>

      {errorMsg ? (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentors.map((m) => (
            <div key={m.login} className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-3">
              <img src={m.avatar_url} alt={m.login} className="w-12 h-12 rounded-full" />
              <div>
                <a href={m.html_url} target="_blank" rel="noreferrer" className="text-blue-400 font-semibold hover:underline">
                  @{m.login}
                </a>
                <p className="text-xs text-slate-300">{m.public_repos} repositorios públicos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}