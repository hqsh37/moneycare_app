// sample the data aynsc
const asyncDatas = [
  {
    type: "create",
    tbl: "category",
    id: "category_12345",
    data: {
      name: "Ăn uống",
      icon: "hamburger",
      iconLib: "FontAwesome5",
      type: "chi",
      desc: "Hello world",
    },
  },
  {
    type: "update",
    tbl: "category",
    id: "category_12345",
    data: {
      name: "Ăn uống và giải khát",
      icon: "hamburger",
      iconLib: "FontAwesome5",
      type: "chi",
    },
  },
  {
    type: "create",
    tbl: "account",
    id: "account_67890",
    data: {
      name: "Tài khoản ngân hàng",
      balance: 5000000,
      type: "bank",
    },
  },
  {
    type: "update",
    tbl: "account",
    id: "account_67890",
    data: {
      name: "Tài khoản ngân hàng",
      balance: 10000000,
      type: "bank",
    },
  },
  {
    type: "create",
    tbl: "transaction",
    id: "transaction_77572",
    data: {
      account_id: "account_67890",
      category_id: "category_12345",
      amount: 50000,
      date: "2022-01-01",
      type: "chi",
      desc: "Mua hamburger",
    },
  },
];
