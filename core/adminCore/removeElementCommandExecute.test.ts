import { ITestData } from "../../commonHelpers/commonForTests";
import { getEnumerableTreeObjectByPropertyWithMethods } from "../../commonHelpers/elementsTreeToHashMap";
import getWorkTreeWithParentElement from "../../commonHelpers/getWorkTreeWithParentElement";
import { TreeWithIdAndParent, idProperty } from "../coreModels/IElement";
import removeElementCommandExecute from "./removeElementCommandExecute";

const getTree = () => (
  {
    [idProperty]: 1,
    type: 'input',
    innerElements: [
      {
        [idProperty]: 3,
        type: 'input',
        innerElements: [],
      },
      {
        [idProperty]: 4,
        type: 'input',
        innerElements: [
          {
            [idProperty]: 2,
            type: 'dropdown',
            innerElements: [
              {
                [idProperty]: 5,
                type: 'input',
                innerElements: [
                  {
                    [idProperty]: 6,
                    type: 'dropdown',
                    innerElements: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

test('SHOULD return true WHEN need to remove root element', () => {
  const elementsMap = getEnumerableTreeObjectByPropertyWithMethods(getWorkTreeWithParentElement(getTree() as any as TreeWithIdAndParent<ITestData>), x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  const result = removeElementCommandExecute(new Set([1]), id => elementsMap.get(id) as any);

  expect(result).toBe(true);
});

test('SHOULD return false WHEN not need to remove root element', () => {
  const elementsMap = getEnumerableTreeObjectByPropertyWithMethods(getWorkTreeWithParentElement(getTree() as any as TreeWithIdAndParent<ITestData>), x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  const result = removeElementCommandExecute(new Set([2]), id => elementsMap.get(id) as any);

  expect(result).toBe(false);
});

test('SHOULD remove elements from tree WHICH was passed', () => {
  const root = getWorkTreeWithParentElement(getTree() as any as TreeWithIdAndParent<ITestData>);

  const elementsMap = getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  const result = removeElementCommandExecute(new Set([2, 3]), id => elementsMap.get(id) as any);

  const elementsCheckMap = getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  expect(result).toBe(false);
  expect(elementsCheckMap.get(2)).toBeUndefined();
  expect(elementsCheckMap.get(3)).toBeUndefined();
  expect(elementsCheckMap.get(5)).toBeUndefined();
  expect(elementsCheckMap.get(6)).toBeUndefined();
});
