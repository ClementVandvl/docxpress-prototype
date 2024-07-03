import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';

export type FileType = 'id_card' | 'passport' | 'other';

export type FileName = `${string}${'.pdf' | '.png'}`;

export type FirebaseFile = {
  filename: string;
  type: FileType;
  url: string;
};

export const uploadFile = async (file: File, fileType: FileType) => {
  const storage = getStorage();
  const storageRef = ref(storage, `files/${fileType}/${file.name}`);
  await uploadBytes(storageRef, file);
  return file.name as FileName;
};

export const getFileUrl = async (file: FirebaseFile): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `files/${file.type}/${file.filename}`);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (file: FirebaseFile) => {
  const storage = getStorage();
  const storageRef = ref(storage, `files/${file.type}/${file.filename}`);
  await deleteObject(storageRef);
};

export const getFiles = async (fileTypes: FileType[]): Promise<FirebaseFile[]> => {
  const storage = getStorage();
  const files: FirebaseFile[] = [];
  for (const fileType of fileTypes) {
    const storageRef = ref(storage, `files/${fileType}`);
    const list = await listAll(storageRef);
    for (const item of list.items) {
      files.push({ filename: item.name, type: fileType, url: await getDownloadURL(item) });
    }
  }
  return files;
};
