import { PINATA_KEY } from "../constants/config";
import axios from 'axios';
import { encodeBase64 } from "./methods";

/**
 * 
 * @param {*} data data to upload file to IPFS
 * @param {*} progress callback to display progress (progress: number) => {}
 * @returns Promise
 */
// export const uploadToIPFS = (data: File, progress: any) => new Promise(async (resolve, reject) => {
//     const formData = new FormData();
//     formData.append('file', data)
//     formData.append('pinataMetadata', JSON.stringify({ name: 'vulcan.launchpad' }));
//     formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

//     const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//         maxBodyLength: Infinity,
//         headers: {
//             //@ts-ignore
//             'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//             'Authorization': `Bearer ${PINATA_KEY}`,
//         },
//         onUploadProgress: progress
//     }).catch(err => {
//         reject("IPFS projectInfo upload failed");
//     });
//     //@ts-ignore
//     resolve("https://ipfs.io/ipfs/" + res.data.IpfsHash);
// });
export const uploadToIPFS = async (data: string, onProgress?: any) => {
    try {
        const formData = new FormData();
        const _data = encodeBase64(data)
        console.log(_data, data)
        const base64Response = await fetch(_data);
        console.log(base64Response)
        const newBlob = await base64Response.blob();
        formData.append("file", newBlob);
        const { data: res } = await axios
            .post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    //@ts-ignore
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: `Bearer ${PINATA_KEY}`,
                },
                onUploadProgress: onProgress,
            });
        return Promise.resolve(`https://ipfs.io/ipfs/${res.IpfsHash}`);
    } catch (err) {
        console.log(err)
        return Promise.reject("failed")
    }
};