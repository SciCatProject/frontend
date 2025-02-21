export const mergeConfig = (baseConfig = {}, overrideConfig = {}) => {
  return Cypress._.merge({}, baseConfig, overrideConfig);
};
