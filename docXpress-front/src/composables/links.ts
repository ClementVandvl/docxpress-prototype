export type EphemeralLinkModel = {
  linkId: string;
  targetUrl: string;
  expirationTime: Date;
};

export const getWorkingEphemerallinks = async (): Promise<EphemeralLinkModel[]> => {
  try {
    const resp = await fetch('http://62.72.19.90:3000/getWorkingEphemeralLinks');
    return await resp.json();
  } catch (e) {
    return [];
  }
};

export const createLink = async (url: string, expirationMinutes: number) => {
  try {
    const resp = await fetch('http://62.72.19.90:3000/create', {
      method: 'POST',
      body: new URLSearchParams({
        target_url: url,
        expiration_minutes: expirationMinutes.toString(),
      }),
    });
    return await resp.json();
  } catch (e) {
    return {};
  }
};
