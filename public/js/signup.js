import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (data, alert) => {
    try {
    const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/users/signup',
        data
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Thank you! You have signed up.');
        window.setTimeout(() => {
            location.assign('/')
        }, 1500);
    }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}