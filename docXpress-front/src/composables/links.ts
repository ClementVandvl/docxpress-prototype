import type { FirebaseFile } from '@/composables/uploadFile';
import { getFiles } from '@/composables/uploadFile';

export type EphemeralLinkModel = {
  linkId: string;
  targetUrl: string;
  expirationTime: Date;
};

export const getWorkingEphemerallinks = async (): Promise<EphemeralLinkModel[]> => {
  try {
    const resp = await fetch('http://62.72.19.90:3000/getWorkingEphemeralLinks');
    const allFiles = await getFiles(['id_card', 'passport', 'other']);
    let links: EphemeralLinkModel[] = await resp.json();
    return links.map((link: EphemeralLinkModel): EphemeralLinkModel | undefined => {
        const file = allFiles.find(f => f.url === link.targetUrl);
        if (!file) return undefined;
        return {
          ...link,
        };
      })
      .filter((file: EphemeralLinkModel | undefined): file is EphemeralLinkModel => file !== undefined);
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
