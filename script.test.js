const {
  convertToKES,
  isValidBid,
  saveBid
} = require('./script');

describe("Auctora Core Logic Tests", () => {

  test("converts USD to KSh correctly", () => {
    expect(convertToKES(10)).toBe(1600);
  });

  test("rejects low bids", () => {
    expect(isValidBid(5000, 3000)).toBe(false);
  });

  test("accepts valid bids", () => {
    expect(isValidBid(5000, 7000)).toBe(true);
  });

  test("saves bid correctly", () => {
    const result = saveBid({}, 1, 9000);
    expect(result).toEqual({ 1: 9000 });
  });

});