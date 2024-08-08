export const useSpeckleAuth = () =>
  useCookie<{ accessToken: string; refreshToken: string } | null>(
    "speckle-auth",
    {
      default: () => null,
      maxAge: 60 * 60 * 24 * 30,
    }
  );
