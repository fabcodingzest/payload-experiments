import { AfterChangeHook, AfterDeleteHook, BeforeChangeHook } from 'payload/dist/collections/config/types';
import { cloudinary } from './cloudinaryConfig';
import streamifier from 'streamifier';
import { UploadApiResponse, UploadStream } from 'cloudinary';
import path from 'path';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { PayloadRequest } from 'payload/dist/express/types';
// Uploading file to cloudinary using streamifier
const streamUpload = (file: { data: Buffer }, id?: string): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const options = {
      folder: 'fab-store',
      invalidate: true,
      ...(id && { public_id: id, folder: null }), // in case of updating the image, we will need the public_id but not the folder as it's already in the URL
    };
    const stream: UploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(file.data).pipe(stream);
  });
};
type Req = PayloadRequest & {
  files: UploadedFile;
};
const beforeChangeHook: BeforeChangeHook = async ({ data, req, operation }) => {
  // DONE: get the file from the req, upload to cloudinary
  const uploadedFile = (req as Req).files.file; // FIXME: PayloadRequest type have file instead of 'files' so that might need a fix
  if (uploadedFile) {
    const result = await streamUpload(uploadedFile, operation === 'update' ? data.cloudPublicId : null);
    data.cloudPublicId = result.public_id;
    data.cloudinaryURL = result.secure_url;
  }
  return data;
};

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
}

const afterChangeHook: AfterChangeHook = ({ doc, operation }) => {
  // DONE: find the doc by the doc.filename on the hard drive of the server
  // if it exists, delete it
  if (doc?.filename) {
    const mainFilePath = path.resolve(__dirname + `../../../cloudinary-media/${doc.filename}`);
    deleteFile(mainFilePath);
  }
  // DONE: and all of its sizes(if any)
  if (doc?.sizes) {
    for (const imageName in doc.sizes) {
      const filePath = path.resolve(__dirname + `../../../cloudinary-media/${doc.sizes[imageName].filename}`);
      deleteFile(filePath);
    }
  }
  // I tried deleting the empty directory as well but it was creating some errors while update operation so I left it.

  return doc;
};

const afterDeleteHook: AfterDeleteHook = ({ doc }) => {
  // DONE: delete the files from Cloudinary using public_id obtained from cloudinary
  cloudinary.uploader.destroy(doc.cloudPublicId, function (result, error) {
    console.log(result, error);
  });
  return doc;
};

export { streamUpload, beforeChangeHook, afterChangeHook, afterDeleteHook };
