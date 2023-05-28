import { ITestData } from "../../commonHelpers/commonForTests";
import { getEnumerableTreeObjectByPropertyWithMethods } from "../../commonHelpers/elementsTreeToHashMap";
import getWorkTreeWithParentElement from "../../commonHelpers/getWorkTreeWithParentElement";
import { IInputTreeNode, TreeWithIdAndParent, idProperty, parent } from "../coreModels/IElement";
import addCommandExecute from "./addCommandExecute"

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

test('SHOULD add elements WHICH was passed', () => {
  const root = getWorkTreeWithParentElement(getTree() as any as TreeWithIdAndParent<ITestData>);

  const elementsMap = getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  const addCommands = [{
    indexToInsert: 1,
    parentElementId: 5,
    newElement: getWorkTreeWithParentElement(
      {
        [idProperty]: 7,
        type: 'dropdown',
        innerElements: [
          {
            [idProperty]: 8,
            type: 'input',
            innerElements: [],
          },
        ],
      } as any as TreeWithIdAndParent<ITestData>),
  },
  {
    indexToInsert: 0,
    parentElementId: 1,
    newElement: getWorkTreeWithParentElement(
      {
        [idProperty]: 9,
        type: 'dropdown',
        innerElements: [
          {
            [idProperty]: 10,
            type: 'input',
            innerElements: [],
          },
        ],
      } as any as TreeWithIdAndParent<ITestData>),
  }];

  addCommandExecute(addCommands, id => elementsMap.get(id) as any);

  const elementsMapActual = getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  expect(elementsMapActual.get(5)?.innerElements[1][idProperty]).toBe(7);
  // expect(elementsMapActual.get(5)?.isInnerElementsChanged).toBe(true);
  expect(elementsMapActual.get(5)).toBe(elementsMapActual.get(7)?.[parent]);
  expect(elementsMapActual.get(1)).toBe(elementsMapActual.get(9)?.[parent]);
  // expect(elementsMapActual.get(1)?.isInnerElementsChanged).toBe(true);
  // expect(elementsMapActual.get(2)?.isInnerElementsChanged).toBe(false);
  // expect(elementsMapActual.get(9)?.isInnerElementsChanged).toBe(false);
  expect(elementsMapActual.get(7)?.innerElements[0][idProperty]).toBe(8);
  expect(elementsMapActual.get(1)?.innerElements[0][idProperty]).toBe(9);
  expect(elementsMapActual.get(9)?.innerElements[0][idProperty]).toBe(10);
});
