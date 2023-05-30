import elementsTreeToHashMap from "./elementsTreeToHashMap";
import getConfig, { ITestData, testId } from "./commonForTests";
import setParentToElements from "./getWorkTreeWithParentElement";
import updateTreeLines from "./updateTreeLine";
import { TreeWithIdAndParent, parent } from "../core/coreModels/IElement";

test('updateTreeLine', () => {
  const elements = setParentToElements(getConfig() as any as TreeWithIdAndParent<ITestData>);
  const elementsMap = elementsTreeToHashMap(elements).enumerableToMap(x => x[testId], x => x);

  const oneElementBefore = elementsMap.get(1);
  const twoElementBefore = elementsMap.get(2);
  const threeElementBefore = elementsMap.get(3);
  const fourElementBefore = elementsMap.get(4);
  const fiveElementBefore = elementsMap.get(5);
  const sixElementBefore = elementsMap.get(6);

  const oneElementInnerElementsBefore = elementsMap.get(1)?.innerElements;
  const twoElementInnerElementsElementBefore = elementsMap.get(2)?.innerElements;
  const threeElementInnerElementsElementBefore = elementsMap.get(3)?.innerElements;
  const fourElementInnerElementsBefore = elementsMap.get(4)?.innerElements;
  const fiveElementInnerElementsBefore = elementsMap.get(5)?.innerElements;
  const sixElementInnerElementsBefore = elementsMap.get(6)?.innerElements;

  const root = updateTreeLines([elementsMap.get(2) as TreeWithIdAndParent<ITestData>]);
  const elementsMapAfterUpdate = elementsTreeToHashMap(root as TreeWithIdAndParent<ITestData>).enumerableToMap(x => x[testId], x => x);

  const oneElementAfter = elementsMapAfterUpdate.get(1);
  const twoElementAfter = elementsMapAfterUpdate.get(2);
  const threeElementAfter = elementsMapAfterUpdate.get(3);
  const fourElementAfter = elementsMapAfterUpdate.get(4);
  const fiveElementAfter = elementsMapAfterUpdate.get(5);
  const sixElementAfter = elementsMapAfterUpdate.get(6);

  const oneElementInnerElementsAfter = elementsMapAfterUpdate.get(1)?.innerElements;
  const twoElementInnerElementsElementAfter = elementsMapAfterUpdate.get(2)?.innerElements;
  const threeElementInnerElementsElementAfter = elementsMapAfterUpdate.get(3)?.innerElements;
  const fourElementInnerElementsAfter = elementsMapAfterUpdate.get(4)?.innerElements;
  const fiveElementInnerElementsAfter = elementsMapAfterUpdate.get(5)?.innerElements;
  const sixElementInnerElementsAfter = elementsMapAfterUpdate.get(6)?.innerElements;

  expect(oneElementBefore).not.toBe(oneElementAfter);
  expect(twoElementBefore).not.toBe(twoElementAfter);
  expect(twoElementBefore[parent]).not.toBe(twoElementAfter[parent]);
  expect(threeElementBefore).toBe(threeElementAfter);
  expect(fourElementBefore).not.toBe(fourElementAfter);
  expect(fourElementBefore[parent]).not.toBe(fourElementAfter[parent]);
  expect(fiveElementBefore).toBe(fiveElementAfter);
  expect(sixElementBefore).toBe(sixElementAfter);

  expect(oneElementInnerElementsBefore).not.toBe(oneElementInnerElementsAfter);
  expect(twoElementInnerElementsElementBefore).not.toBe(twoElementInnerElementsElementAfter);
  expect(threeElementInnerElementsElementBefore).toBe(threeElementInnerElementsElementAfter);
  expect(fourElementInnerElementsBefore).not.toBe(fourElementInnerElementsAfter);
  expect(fiveElementInnerElementsBefore).toBe(fiveElementInnerElementsAfter);
  expect(sixElementInnerElementsBefore).toBe(sixElementInnerElementsAfter);
});
