export default {
    // vue-ls options
  storageOptions: {
    name: "ls", // name variable Vue.[ls] or this.[$ls],
    storage: "local" // storage name session, local, memory
  },

  // vue2filter options
  vue2filterOptions: {
    capitalize: {
      onlyFirstLetter: false
    },
    number: {
      format: "0",
      thousandsSeparator: ",",
      decimalSeparator: "."
    },
    bytes: {
      decimalDigits: 2
    },
    percent: {
      decimalDigits: 2,
      multiplier: 100
    },
    currency: {
      symbol: "$",
      decimalDigits: 2,
      thousandsSeparator: ",",
      decimalSeparator: ".",
      symbolOnLeft: true,
      spaceBetweenAmountAndSymbol: false,
      showPlusSign: false
    },
    pluralize: {
      includeNumber: false
    },
    ordinal: {
      includeNumber: false
    }
  },

  // editor options
  editorOptions: {
    minHeight: '300px',
    language: 'vi-VN',
    useCommandShortcut: true,
    usageStatistics: false,
    hideModeSwitch: false,
  },

  // banner page
  bannerPages: [
    { value: 'home', name: 'Trang chủ' },
    { value: 'category', name: 'Trang danh mục' },
    { value: 'detail', name: 'Trang chi tiết sản phẩm' },
  ]
};
  