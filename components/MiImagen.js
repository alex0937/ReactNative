import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

export default function MiImagen({ publicId, ancho = 300, alto = 300 }) {
  // 1. instancia (una sola vez)
  const cld = new Cloudinary({
    cloud: { cloudName: 'dckrgbvzg' }, // tu cloud name
    url: { secure: true }              // https
  });

  // 2. construye la imagen
  const img = cld
    .image(publicId)                  // id que subiste a Cloudinary
    .format('auto')                   // f=auto
    .quality('auto')                  // q=auto
    .resize(
      auto()
        .gravity(autoGravity())
        .width(ancho)
        .height(alto)
    );

  // 3. renderiza
  return <AdvancedImage cldImg={img} />;
}