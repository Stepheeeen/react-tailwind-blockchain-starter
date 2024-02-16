import { useState } from 'react';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

export const useInfura = () => {
  const projectId = '';
  const projectSecret = '';
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const ipfsBaseURL = 'https://ipfs.infura.io/ipfs/';

  const uploadFile = async (file) => {
    let ipfs;
    try {
      ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth
        }
      });
    } catch (error) {
      console.error('Error connecting to IPFS via Infura', error);
      return;
    }
    try {
      const response = await ipfs.add(file);
      console.log('IPFS file hash:', response.cid.toString());
      return response.cid.toString();
    } catch (error) {
      console.error('Error uploading file to IPFS', error);
    }
  };

  const getIPFSURL = (cid) => {
    return `${ipfsBaseURL}${cid}`;
  };

  return { uploadFile, getIPFSURL };
};