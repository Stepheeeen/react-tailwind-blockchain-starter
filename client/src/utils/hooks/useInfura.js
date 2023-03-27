import { useState } from 'react';
import ipfsClient from 'ipfs-http-client';

const useInfura = () => {
    const [ipfs, setIpfs] = useState(null);

    const connectIpfs = async () => {
        const projectId = '23...XXX';
        const projectSecret = '23...XXX';

        const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

        try {
            const ipfs = ipfsClient({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth
                }
            });
            setIpfs(ipfs);
            console.log('Connected to IPFS via Infura');
        } catch (error) {
            console.error('Error connecting to IPFS via Infura', error);
        }
    };

    const uploadFile = async (file) => {
        if (!ipfs) {
            console.error('IPFS client not connected');
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

    return { connectIpfs, uploadFile };
};

export default useInfura;