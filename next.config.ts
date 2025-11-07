import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /*
   * Desactivamos React Compiler para evitar el error
   * "An unknown Component is an async Client Component" en componentes cliente.
   * Si se quiere volver a activar, hacerlo en modo de anotaciones:
   *   reactCompiler: { compilationMode: 'annotation' }
   * y anotar explícitamente los componentes a optimizar.
   */
  reactCompiler: false,

  async rewrites() {
    // Use NEXT_PUBLIC_API_URL for consistency with the rest of the app
    // Default to http://localhost:3000/api for development
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
