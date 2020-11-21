
export const handleSubmit = async (name, location) => {
    await new Promise((res, rej) => {
        setTimeout(() => { res(1) }, 2000);
    })

    return { error: false, message: 'something went wrong', data: { tweets: ['933354946111705097', '1330062304709373955'], keywords: ['alpha', 'helios', 'doing'] } };
}