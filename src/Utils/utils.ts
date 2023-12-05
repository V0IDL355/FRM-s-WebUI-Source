export async function connected(ip) {
  return await fetch(`http://${ip}/getAll`)
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("ip", ip);
        return true;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
