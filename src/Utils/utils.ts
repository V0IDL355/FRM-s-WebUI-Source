export async function connected(ip) {
  return await fetch(`http://${ip}/getCoffee`)
    .then((response) => {
      if (response.status === 418) {
        localStorage.setItem("ip", ip);
        return true;
      }
    })
    .catch(() => {
      return false;
    });
}
