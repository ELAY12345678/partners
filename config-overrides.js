const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#6B24F8",
      "@secondary-color": "hsla(0,0%,100%,.75)",
      "@icon-size-large": "28px",
      "@font-size-large": "28px",
      "@font-size-medium": "20px",
      "@font-size-small": "18px",
      "@font-size-tiny": "16px",
      /* Header Theme */
      "@layout-header-background": "#fff",
      "@layout-header-height": "100px",
      /* Menu */
      "@menu-item-active-border-width": "0px",
      "@menu-inline-toplevel-item-height": "60px",
      "@menu-item-font-size": "@font-size-small",
      "@menu-item-height": "50px",
      /* "@menu-bg": "@primary-color", */
      "@menu-collapsed-width": "80px",
      /* Layout */
      "@layout-body-background": "#e5ecee"
    }
  })
);
