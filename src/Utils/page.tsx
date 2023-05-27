function pageOptions(pageSize = 100) {
  const options: number[] = [];
  for (let i = 10; i <= pageSize; i += 10) {
    options.push(i);
  }
  return options;
}

export default pageOptions;
