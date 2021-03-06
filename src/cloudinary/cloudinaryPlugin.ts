import { Config } from 'payload/config';
import { afterChangeHook, afterDeleteHook, beforeChangeHook } from './hooks/CloudinaryMediaHooks';

const addCloudinary = (incomingConfig: Config): Config => {

  const config: Config = {
    ...incomingConfig,
    collections: incomingConfig.collections.map((collection) => {
      if (Boolean(collection.slug === 'cloudinary_media')) {
        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            beforeChange: [beforeChangeHook],
            afterChange: [afterChangeHook],
            afterDelete: [afterDeleteHook],
          },
          fields: [
            ...collection.fields,
            {
              name: 'cloudPublicId',
              type: 'text',
              access: {
                // prevent writing to the field, instead hooks are responsible for this
                create: () => false,
                update: () => false,
              },
              admin: {
                position: 'sidebar',
                condition: (data) => Boolean(data?.cloudPublicId),
                readOnly: true,
              },
            },
            {
              name: 'cloudinaryURL',
              type: 'text',
              access: {
                // prevent writing to the field, instead hooks are responsible for this
                create: () => false,
                update: () => false,
              },
              // I don't think we need this because I already set it in beforeChangeHook, I hope I am not missing something? but everything works smoothly for now
              // hooks: {
              //   afterRead: [
              //     ({ data }) => {
              //       return data.cloudinaryURL;
              //     },
              //   ],
              // },
              admin: {
                position: 'sidebar',
                readOnly: true,
                // only show the field when it has a value
                condition: (data) => Boolean(data?.cloudinaryURL),
              },
            },
          ],
        };
      }

        return collection
    })
  }

  return config;

}

export default addCloudinary