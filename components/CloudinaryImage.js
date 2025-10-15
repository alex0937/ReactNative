// src/components/CloudinaryImage.js
import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const cld = new Cloudinary({
  cloud: { cloudName: 'dckrgbvzg' }, // <-- cambia aquí
  url: { secure: true },
});

export default function CloudinaryImage({ publicId, width = 120, height = 120, style }) {
  const img = cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width).height(height));

  return <AdvancedImage cldImg={img} style={style} />;
}