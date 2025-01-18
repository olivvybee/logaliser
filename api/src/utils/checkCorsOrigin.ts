export const checkCorsOrigin = (origin: string) => {
  if (origin.startsWith('http://localhost')) {
    return origin;
  }

  const allowedOrigins = process.env.CORS_ORIGINS?.split(';') || [];
  if (allowedOrigins.includes(origin)) {
    return origin;
  }

  return '';
};
