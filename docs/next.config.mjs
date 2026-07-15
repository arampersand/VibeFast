/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Páginas de docs que se movieron de sección (reorg de la IA)
    return [
      {
        source: "/docs/fundamentos/prepara-tu-compu",
        destination: "/docs/setup/prepara-tu-compu",
        permanent: true,
      },
      {
        source: "/docs/fundamentos/github-ssh",
        destination: "/docs/setup/github-ssh",
        permanent: true,
      },
      {
        source: "/docs/setup/instalacion",
        destination: "/docs/setup/prepara-tu-compu",
        permanent: true,
      },
      // Páginas movidas a la sección Configuración
      ...["variables-de-entorno", "google-oauth", "openai", "resend", "posthog", "stripe"].map(
        (slug) => ({
          source: `/docs/setup/${slug}`,
          destination: `/docs/configuracion/${slug}`,
          permanent: true,
        })
      ),
    ]
  },
}

export default nextConfig
