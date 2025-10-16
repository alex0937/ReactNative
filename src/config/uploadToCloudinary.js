export const uploadToCloudinary = async (uri) => {
  const cloudName = 'dmj3gzhq4';
  const uploadPreset = 'upload_preset_app';

  const formData = new FormData();

  // Si el picker devuelve result.assets, usamos eso:
  const fileUri = uri?.uri ? uri.uri : uri;

  formData.append('file', {
    uri: fileUri,
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
      }
    );

    const data = await response.json();
    console.log('>>> Cloudinary response:', data);

    if (!data.secure_url) throw new Error('No se pudo obtener URL de Cloudinary');
    return data.secure_url;
  } catch (error) {
    console.error('>>> Error al subir imagen:', error);
    throw new Error('No se pudo subir la imagen');
  }
};
