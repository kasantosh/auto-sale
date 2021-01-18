export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
}

export const showAlert = (type, msg, btn) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}"><img class="alert-icon" src="/img/icons/${type}-icon.png"><p class="alert-msg">${msg}</p></div>`;

    btn === 'password' ? document.querySelector('.form-user-password').insertAdjacentHTML('afterend', markup) : document.querySelector('.show-alert').insertAdjacentHTML('beforeend', markup);
    
    window.setTimeout(hideAlert, 5000);
}