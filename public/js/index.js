import { login } from './login';
import { logout } from './login';
import { updateSettings } from './updateSettings';
import { signup } from './signup';
import { postAdData } from './postAdData';
// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.main-section-nav-logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userSignupForm = document.querySelector('.form-signup');
const postAd = document.querySelector('.form-postad');

// VALUES
    

// DELEGATION
if (loginForm) {
    document.querySelector('.form').addEventListener('submit', e => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        e.preventDefault();
        login(email, password);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);
        updateSettings(form, 'data');
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (userSignupForm) {
    userSignupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
       
        signup({ name, email, password, passwordConfirm }, 'signup');
    });
}

if (postAd) {
    postAd.addEventListener('submit', e => {
        e.preventDefault();

        const postAdForm = new FormData();
        postAdForm.append('make', document.getElementById('make').value);
        postAdForm.append('model', document.getElementById('model').value);
        postAdForm.append('year', Number(document.getElementById('year').value));
        postAdForm.append('price', Number(document.getElementById('price').value));
        postAdForm.append('mileage', Number(document.getElementById('mileage').value));
        postAdForm.append('location', document.getElementById('location').value);
        postAdForm.append('exteriorColour', document.getElementById('ext-colour').value);
        postAdForm.append('interiorColour', document.getElementById('int-colour').value);

        const bType = document.getElementById('body-type');
        const bTypeValue = bType.options[bType.selectedIndex].value;
        postAdForm.append('bodyType', bTypeValue)

        const fType = document.getElementById('fuel-type');
        const fTypeValue = fType.options[fType.selectedIndex].value;
        postAdForm.append('fuelType', fTypeValue);

        const dType = document.getElementById('drive-type');
        const dTypeValue = dType.options[dType.selectedIndex].value;
        postAdForm.append('driveType', dTypeValue);

        const transType = document.getElementById('transmission');
        const transTypeValue = transType.options[transType.selectedIndex].value;
        postAdForm.append('transmission', transTypeValue);

        const passNo = document.getElementById('passengers');
        const passNoValue = passNo.options[passNo.selectedIndex].value; 
        postAdForm.append('passengers', Number(passNoValue));

        postAdForm.append('condition', document.getElementById('condition').value);

        postAdForm.append('title', document.getElementById('title').value);
        postAdForm.append('description', document.getElementById('description').value);
        postAdForm.append('imageCover', document.getElementById('image-cover').files[0]);

        for (let i = 0; i < 5; i++) {
            if (document.getElementById(`image-${i + 1}`).files[0])
            postAdForm.append('image', document.getElementById(`image-${i + 1}`).files[0]);
        }
        postAdData(postAdForm, 'data');
        
    });
}
