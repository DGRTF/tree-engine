import { getEnumerableTreeObjectByPropertyWithMethods } from "./elementsTreeToHashMap";
import setParentToElements from "./getWorkTreeWithParentElement";
import getConfig, { testId } from "./commonForTests";
import { parent } from "../core/coreModels/IElement";

test('setParentToElement should be valid parentId', () => {
  const config = getConfig();

  const actual = setParentToElements(config as any);

  const elementsHashSet = getEnumerableTreeObjectByPropertyWithMethods(actual, x => x.innerElements)
    .enumerableToMap(x => x[testId], x => x);

  expect(elementsHashSet.get(1)?.[parent]).toBe(undefined);
  expect(elementsHashSet.get(2)?.[parent]).toBe(elementsHashSet.get(4));
  expect(elementsHashSet.get(3)?.[parent]).toBe(elementsHashSet.get(1));
  expect(elementsHashSet.get(4)?.[parent]).toBe(elementsHashSet.get(1));
  expect(elementsHashSet.get(5)?.[parent]).toBe(elementsHashSet.get(2));
  expect(elementsHashSet.get(6)?.[parent]).toBe(elementsHashSet.get(5));
});
