

export function getToken(){


  if (typeof window !== 'undefined') {
    // Assurez-vous que window est disponible pour éviter des erreurs en SSR
    return localStorage.getItem('token');
  }
  return null; // ou gérer différemment côté serveur
}
