import axios from 'axios';
import { showAlert } from './alert';

// type is either password or data
export const postAdData = async (data, type) => {
    try {     
        const res = await axios({
        method: 'POST',
        url: '/api/v1/autos/',
        data
    });
    if (res.data.status === 'success') {
        showAlert('success', `Posted ad to website successfully`, `${type}`);
        window.setTimeout(() => {
            location.assign('/my-ads')
        }, 1500);
    }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
   
}