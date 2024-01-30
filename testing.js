const data = async () => {
  const simData = [
    {
      name: "AIRTEL",
      isIndia: true,
      plan: [
        { Amount: 269, days: 28, data: "2gb perDay" },
        { Amount: 399, days: 54, data: "2gb perDay" },
      ],
    },
    {
      name: "JIO",
      isIndia: true,
      plan: [
        { Amount: 299, days: 28, data: "2gb perDay" },
        { Amount: 309, days: 54, data: "2gb perDay" },
      ],
    },
  ];
  
  for(const s of simData){
    console.log(s);
  }
};

(async () => {
  await data();
})();
