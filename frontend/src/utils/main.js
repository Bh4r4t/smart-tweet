

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const handleSubmit = async (name, location) => {
    try {
        await new Promise((res, rej) => {
            setTimeout(() => { res(1) }, 2000);
        })
        let resp = await fetch(`${SERVER_URL}/?product_name=${name}&location=${location}`);
        let data = await resp.json();
        if (data.error === true) {
            throw Error(data.message);
        }
        return data;
    } catch (err) {
        return {
            error: true,
            message: 'Something Went Wrong',
        }
    }
}