const { convertToKES, isValidBid } = require('./script');

test("KES conversion", () => {
  expect(convertToKES(10)).toBe(1600);
});

test("valid bid", () => {
  expect(isValidBid(1000, 2000)).toBe(true);
});