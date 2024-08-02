export const useSpeckleAuth = () =>
  useState<{ accessToken: string; refreshToken: string }>(
    "speckle-auth",
    undefined
  );
