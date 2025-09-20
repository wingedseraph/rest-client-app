export const routes = {
  MAIN: '/',
  public: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  private: {
    REST_CLIENT: '/rest-client',
    HISTORY: '/history',
    VARIABLES: '/variables',
  },
} as const;

export const publicRoutes = Object.values(routes.public);
export const privateRoutes = Object.values(routes.private);

export type PublicRoutes = (typeof publicRoutes)[number];
export type PrivateRoutes = (typeof privateRoutes)[number];
