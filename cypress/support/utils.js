export const mergeConfig = (baseConfig = {}, overrideConfig = {}) => {
  return Cypress._.merge({}, baseConfig, overrideConfig);
};

export const getFormattedFileNamingDate = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();

  return y + "-" + m + "-" + d;
};
