import type { FileType } from '@/composables/uploadFile';

export const getFileType = async (file: File): Promise<FileType> => {
  try {
    const resp = await fetch('http://62.72.19.90:3000/ocr', {
      method: 'POST',
      body: file,
    });
    const type = (await resp.text()) as 'id_card' | 'passport' | 'unknown';
    if (type === 'id_card' || type === 'passport') return type;
    return 'other';
  } catch (e) {
    return 'other';
  }
};
