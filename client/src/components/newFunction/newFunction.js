

export const onCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const onCurDate = (date) => {
    const arrDate = date.split('-');
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    return `${arrDate[2]} ${months[arrDate[1] - 1]}`;
}

export const role = () => {
    const token = getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;

    return role;
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const getTokenExpirationDate = (token) => {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (!decoded.exp) {
        return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
}

export const checkTokenExpiration = (token, logoutFunction) => {
    const expirationDate = getTokenExpirationDate(token);
    if (!expirationDate) {
        return;
    }

    const now = new Date();
    if (expirationDate.getTime() <= now.getTime()) {
        logoutFunction();
    } else {
        const timeUntilExpiration = expirationDate.getTime() - now.getTime();
        setTimeout(() => {
            logoutFunction();
            alert('Your session has expired. Please log in again.');
        }, timeUntilExpiration);
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
}