import apiClient from '.';

async function uploadFile(endpoint: string, file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiClient.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data;
}

async function uploadFiles(endpoint: string, files: File[]): Promise<any[]> {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  const res = await apiClient.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data ?? [];
}

export const UploadService = {
  avatar: (file: File) =>
    uploadFile('/profile/avatar', file),

  logoLight: (file: File) =>
    uploadFile('/profile/logo-light', file),

  logoDark: (file: File) =>
    uploadFile('/profile/logo-dark', file),

  watermark: (file: File) =>
    uploadFile('/profile/watermark', file),

  listingPhotos: (listingId: string, files: File[]) =>
    uploadFiles(`/listings/${listingId}/photos`, files),

  listingDocument: (listingId: string, file: File) =>
    uploadFile(`/listings/${listingId}/documents`, file),
};
