import addElementToArrayByIndex from "./addElementToArrayByIndex";

test('addElementToArrayByIndex', () => {
  const inputArray = [1, 2, 4];
  const index = 2;

  const actual = addElementToArrayByIndex(inputArray, 3, index);

  expect(actual[index]).toStrictEqual(3);
  expect(actual.length).toBe(inputArray.length + 1);
});
