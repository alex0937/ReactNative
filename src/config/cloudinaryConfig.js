import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// ✅ Configuración base
const cloudName = 'TU_CLOUD_NAME'; // <-- cambia aquí por tu cloud name

export const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
  url: {
    secure: true, // usa https
  },
});

// ✅ Función reutilizable para generar imagen optimizada
export const getOptimizedImage = (publicId, width = 300, height = 300) => {
  return cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width).height(height));
};