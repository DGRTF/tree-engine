import editElementCommandExecute from "./editElementCommandExecute";
import getTree, { ITestData } from "../../commonHelpers/commonForTests";
import getWorkTreeWithParentElement from "../../commonHelpers/getWorkTreeWithParentElement";
import { getEnumerableTreeObjectByPropertyWithMethods } from "../../commonHelpers/elementsTreeToHashMap";
import { IInputTreeNode, TreeWithIdAndParent, idProperty } from "../coreModels/IElement";

test('editElementCommandExecute', () => {
  const root = getWorkTreeWithParentElement(getTree() as any as TreeWithIdAndParent<ITestData>);

  const elementsMap = getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  const elementsEdit = new Map([
    [1, [{}]],
    [2,
      [
        {
          name: 'name',
          type: 'input'
        },
      ]
    ]
  ] as const);

  const newRoot = editElementCommandExecute(elementsEdit, id => elementsMap.get(id) as TreeWithIdAndParent<ITestData>);

  if (!newRoot)
    throw new Error('Can not false');

  const elementsMapNew = getEnumerableTreeObjectByPropertyWithMethods(newRoot[0], x => x.innerElements)
    .enumerableToMap(x => x[idProperty], x => x);

  const firstChangedElement = elementsMapNew.get(1);
  const secondChangedElement = elementsMapNew.get(2);

  expect(firstChangedElement?.type).toBe('input');
  expect(secondChangedElement?.type).toBe('input');
  expect((secondChangedElement as any).name).toBe('name');
});
