export function initSpeckleAuth() {
  const appId = useRuntimeConfig().public.speckleAppId;
  const codeChallgenge = crypto.randomUUID();

  localStorage.setItem("SPECKLE_CODE_CHALLENGE", codeChallgenge);
  localStorage.removeItem("SPECKLE_TOKEN");
  localStorage.removeItem("SPECKLE_REFRESH_TOKEN");

  const speckleAuthUrl = `https://app.speckle.systems/authn/verify/${appId}/${codeChallgenge}`;

  const width = 600;
  const height = 800;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const options = `width=${width},height=${height},left=${left},top=${top}`;

  window.open(speckleAuthUrl, "Connect Ark to Speckle", options);
}
