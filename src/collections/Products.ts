import { CollectionConfig } from 'payload/types';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
    },
    {
      name: 'upload_type',
      label: 'Upload',
      type: 'select',
      options: [
        {label: 'Upload on Cloudinary', value: 'CLOUDINARY UPLOAD'},
        {label: 'Upload on Server', value: 'SERVER UPLOAD'},
      ]
    },
    {
      name: 'server-image',
      label: 'Upload Image to Server',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data: Record<string, unknown>) :boolean=> {
          if(data.upload_type === 'SERVER UPLOAD') return true;
          return false;
        }
      }
    },
    {
      name: 'cloudinary-image',
      label: 'Upload Product Image on Cloudinary',
      type: 'upload',
      relationTo: 'cloudinary-media',
      admin: {
        condition: (data: Record<string, unknown>) :boolean=> {
          if(data.upload_type === 'CLOUDINARY UPLOAD') return true;
          return false;
        }
      }
    },
  ],
};

export default Products;
