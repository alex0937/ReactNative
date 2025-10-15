export const uploadToCloudinary = async (uri) => {
  const cloudName = 'TU_CLOUD_NAME'; // ← cambia
  const uploadPreset = 'TU_UPLOAD_PRESET'; // ← crea uno "unsigned" en Cloudinary

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const data = await response.json();
    return data.secure_url; // URL de la imagen subida
  } catch (error) {
    console.error('>>> Error al subir imagen:', error);
    throw new Error('No se pudo subir la imagen');
  }
};