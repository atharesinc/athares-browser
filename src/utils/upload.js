import { RNS3 } from 'react-native-aws3';

let API_KEYS = null;

export async function uploadToAWS(file) {
  file.name = createUUID();
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

function createUUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c,
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
