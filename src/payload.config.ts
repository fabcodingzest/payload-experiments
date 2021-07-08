import { buildConfig } from 'payload/config';
import path from 'path';

import Users from './collections/Users';
import Products from './collections/Products';
import CloudinaryMedia from './collections/CloudinaryMedia';
import Image from './collections/Image';
import addCloudinary from './cloudinary/cloudinaryPlugin';

const CloudinaryMediaHooks = path.resolve(__dirname, 'cloudinary/hooks/CloudinaryMediaHooks');
const mockModulePath = path.resolve(__dirname, 'mocks/emptyObject');

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          [CloudinaryMediaHooks]: mockModulePath,
        },
      },
    }),
  },
  collections: [Users, Products, CloudinaryMedia, Image],
  plugins: [
    // Add cloudinary plugin
    addCloudinary,
  ],
});
