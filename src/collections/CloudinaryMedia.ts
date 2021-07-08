import { CollectionConfig } from 'payload/types';

const CloudinaryMedia: CollectionConfig = {
  slug: 'cloudinary_media',
  upload: {
    // thumbnail image for the admin UI will use cloudinary instead of the admin host URL
    adminThumbnail: ({ doc }) => String(doc.cloudinaryURL),
  },
  fields: [
    {
      label: 'Alt Text',
      name: 'altText',
      type: 'text',
      required: true,
    },
  ],
};
export default CloudinaryMedia;
