const getGunCircle = (gun, pub, priv) => {
    return new Promise(resolve => {
        let circleUser = gun.user();
        circleUser.auth(pub, priv, data => {
            //success
            console.log(data);
            if (data.sea) {
                resolve(circleUser);
            }
        });
    });
};

const createGunCircle = (gun, pub, priv) => {
    return new Promise(resolve => {
        let circleUser = gun.user();
        circleUser.create(pub, priv, ack => {
            //failed to create this user
            if (ack.err) {
                resolve({ success: false, err: ack.err });
            } else if (ack.pub !== '' && ack.ok === 0) {
                resolve({ success: true, pub: ack.pub });
            } else {
                console.log('Something else happened', ack);
                resolve({ success: false, err: '???' });
            }
        });
    });
};

const randPass = () => {
    return (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15)
    );
};
export { createGunCircle, getGunCircle, randPass };
