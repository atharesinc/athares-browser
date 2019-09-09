import { RNS3 } from 'react-native-aws3';

let API_KEYS = null;

export async function uploadToAWS(file) {
  try {
    let keys =
      API_KEYS ||
      (await fetch(`${process.env.REACT_APP_AUTH_API}/creds`).then(res =>
        res.json(),
      ));
    const { accessKey, secretKey } = keys;

    const options = {
      bucket: 'athares-images',
      region: 'us-east-2',
      accessKey,
      secretKey,
      successActionStatus: 201,
    };

    let response = await RNS3.put(file, options);
    if (response.status !== 201) {
      return { error: 'Failed to upload image to S3' };
    }
    return {
      url: response.body.postResponse.location,
      name: response.body.postResponse.key,
    };
  } catch (err) {
    return { error: err.message };
  }
}
