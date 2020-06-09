export default function join(...parts: string[]) {
    let joined = parts.join('/');
    return normalize(joined);
}

function normalize(str: string) {
    // replace all back slashes
    str = str.replace(/\\/g, '/');

    // make sure protocol is followed by two slashes
    str = str.replace(/:\//g, '://');

    // remove consecutive slashes
    str = str.replace(/([^:\s])\/+/g, '$1/');

    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

    // replace ? in parameters with &
    str = str.replace(/(\?.+)\?/g, '$1&');

    return str;
}
