export const useSpeckleAuth = () =>
  useCookie<{ accessToken: string; refreshToken: string } | null>(
    "speckle-auth",
    {
      default: () => null,
    }
  );
