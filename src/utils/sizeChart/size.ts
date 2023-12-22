export const SizeChart = [
    {
      "name": "tee",
      "code": "https://bizweb.dktcdn.net/100/318/614/files/tee-mo-i-4sz-8ec84e9b-e4d3-489e-8df7-e441fc36a4a2.jpg?v=1659346598014",
    },
    {
      "name": "jean",
      "code": "https://bizweb.dktcdn.net/100/318/614/files/size-chart-2021-form-jeans-cargo-pant-compressed.jpg?v=1640935052242",
    },
    {
      "name": "jacket",
      "code": "https://bizweb.dktcdn.net/100/318/614/files/z3137365171848-b4c686373ba9c0a0563a0c752812f06a-2818a2a4-0b31-449d-8e24-aa1c098e7266.jpg?v=1643170782079",
    },
    {
        "name": "hoodie",
        "code": "https://bizweb.dktcdn.net/100/318/614/files/z3630219285320-0d2e46b23cf0d567b4e0c3781945ab1f.jpg?v=1660032676798",
    },
]

export const getCodeByName = (name: string): string | undefined => {
    const category = SizeChart.find((item) => item.name === name);
    return category?.code;
  };