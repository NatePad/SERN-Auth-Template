const Cookie = {
  setCookie: (name, value) => {
    document.cookie = `${name}=${value}; SameSite=Strict`
  }
}

export default Cookie;