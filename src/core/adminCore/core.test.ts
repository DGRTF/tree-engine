import Engine from './core';
import { parent, TreeWithIdReadonly, idProperty } from '../coreModels/IElement';
import { ITestData, ITestDataBase } from '../../commonHelpers/commonForTests';
import getWorkTreeWithParentElement from '../../commonHelpers/getWorkTreeWithParentElement';
import updateTreeLines from '../../commonHelpers/updateTreeLine';
import { getEnumerableTreeObjectByPropertyWithMethods } from '../../commonHelpers/elementsTreeToHashMap';
import { addIterableMethodsInObject } from 'iterate_library';

const testId = Symbol();

const getConfig = () => (
  {
    [testId]: 1,
    type: 'input',
    innerElements: [
      {
        [testId]: 2,
        type: 'input',
        innerElements: [],
      },
      {
        [testId]: 3,
        type: 'input',
        innerElements: [
          {
            [testId]: 4,
            type: 'dropdown',
            innerElements: [
              {
                [testId]: 5,
                type: 'input',
                innerElements: [
                  {
                    [testId]: 6,
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
  }) as ITestDataBase;

const getInnerElementsCollections = (treeNodes: Iterable<[number, TreeWithIdReadonly<ITestData>]>) =>
  addIterableMethodsInObject<typeof treeNodes, [number, TreeWithIdReadonly<ITestData>]>(treeNodes)
    .enumerableMap(x => x[1])
    .enumerableToMap(x => x[testId] as number, x => x.innerElements);

const checkThatNodesWasUpdated = (testIdsNodesWhichWasUpdated: readonly number[],
  oldMap: Readonly<Map<number, TreeWithIdReadonly<ITestData>>>,
  innerElementsCollectionOldMap: Readonly<Map<number, readonly TreeWithIdReadonly<ITestData>[]>>,
  newMap: Readonly<Map<number, TreeWithIdReadonly<ITestData>>>) => {

  testIdsNodesWhichWasUpdated.forEach(x => {
    expect(oldMap.get(x)).not.toBe(newMap.get(x));
  });

  checkThatInnerElementsWasUpdated(testIdsNodesWhichWasUpdated, innerElementsCollectionOldMap, newMap);
}

const checkThatInnerElementsWasUpdated = (testIdsNodesWhichWasUpdated: readonly number[],
  innerElementsCollectionOldMap: Readonly<Map<number, readonly TreeWithIdReadonly<ITestData>[]>>,
  newMap: Readonly<Map<number, TreeWithIdReadonly<ITestData>>>) =>

  testIdsNodesWhichWasUpdated.forEach(x => {
    expect(innerElementsCollectionOldMap.get(x)).not.toBe(newMap.get(x)?.innerElements);
  });

const checkNotChangedNodes = (notChangedNOdesTestIds: readonly number[],
  oldMap: Readonly<Map<number, TreeWithIdReadonly<ITestData>>>,
  innerElementsCollectionOldMap: Readonly<Map<number, readonly TreeWithIdReadonly<ITestData>[]>>,
  newMap: Readonly<Map<number, TreeWithIdReadonly<ITestData>>>) =>

  notChangedNOdesTestIds.forEach(x => {
    expect(oldMap.get(x)).toBe(newMap.get(x));
    expect(innerElementsCollectionOldMap.get(x)).toBe(newMap.get(x)?.innerElements);
  });


const getEngineAndTreeMap = () => {
  const engine = new Engine<ITestDataBase>(getConfig(),
    getWorkTreeWithParentElement,
    []
  );

  // ACT
  let actualElements = engine.getElements();

  if (!actualElements)
    throw new Error('Root not exists');

  const oldMap = getEnumerableTreeObjectByPropertyWithMethods(actualElements, x => x.innerElements)
    .enumerableToMap(x => x[testId] as number, x => x);

  return [engine, oldMap] as const;
}

const getElementsFromEngine = (engine: Engine<ITestDataBase>) => {
  const actualElements = engine.getElements();

  if (!actualElements)
    throw new Error('Root not exists');

  return getEnumerableTreeObjectByPropertyWithMethods(actualElements, x => x.innerElements)
    .enumerableToMap(x => x[testId], x => x);
}

test('SHOULD get elements with id symbol property WHEN we got schema', () => {
  const [, oldMap] = getEngineAndTreeMap();

  const ids = getIdsFromEachNode(oldMap.get(1) as any);
  const uniqueNotEmptyIds = new Set(ids.filter(x => x));

  // ASSERT
  // getEnumerableTreeObjectByPropertyWithMethods(oldMap.get(1) as TreeWithIdReadonly<ITestData>, x => x.innerElements)
  //   .enumerableForEach(x => expect(x.hasOwnProperty(parent)).toBe(false));

  expect(uniqueNotEmptyIds.size).toBe(6);
});

const getIdsFromEachNode = (root: TreeWithIdReadonly<ITestData>): number[] =>
  [root[idProperty], ...root.innerElements.flatMap(getIdsFromEachNode)];

test('SHOULD remove element from schema', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const lastId = oldMap.get(6)?.[idProperty]!;
  const innerElementsCollection = getInnerElementsCollections(oldMap);

  expect(() => engine.removeElement(345)).toThrow();

  engine.removeElement(lastId);

  const actualMap = getElementsFromEngine(engine);

  // ASSERT
  expect(getIdsFromEachNode(actualMap.get(1) as any).some(x => x === lastId)).toBe(false);

  checkThatNodesWasUpdated([1, 3, 4, 5], oldMap, innerElementsCollection as any, actualMap);
  checkNotChangedNodes([2], oldMap, innerElementsCollection as any, actualMap);
});

test('SHOULD remove root element from schema', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const elementToRemoveId = oldMap.get(1)?.[idProperty] ?? 0;
  engine.removeElement(elementToRemoveId);

  // ASSERT
  expect(engine.getElements()).toBe(undefined);
});

test('SHOULD add element in a schema', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const lastId = oldMap.get(2)?.[idProperty]!;
  const indexToInsert = 0;
  const innerElementsCollection = getInnerElementsCollections(oldMap);

  const elementToInsert = {
    type: 'input' as const,
    innerElements: [],
  };

  expect(() =>
    engine.addElement(
      elementToInsert,
      -1,
      lastId))
    .toThrow();

  engine.addElement(
    elementToInsert,
    indexToInsert,
    lastId);

  const actualMap = getElementsFromEngine(engine);

  // ASSERT
  expect(actualMap.get(2)?.innerElements[indexToInsert]).toBe(elementToInsert);
  const ids = getIdsFromEachNode(actualMap.get(1) as any);
  const uniqueNotEmptyIds = new Set(ids.filter(x => x));
  expect(uniqueNotEmptyIds.size).toBe(7);

  checkThatNodesWasUpdated([1, 2], oldMap, innerElementsCollection as any, actualMap);
  checkNotChangedNodes([3, 4, 5, 6], oldMap, innerElementsCollection as any, actualMap);
});

test('SHOULD edit element in a schema', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const lastId = oldMap.get(6)?.[idProperty];
  const innerElementsCollection = getInnerElementsCollections(oldMap);

  expect(() =>
    engine.changeElement(lastId!, {
      type: 'input',
      name: 'name',
      innerElements: [],
    }))
    .toThrow();

  expect(() =>
    engine.changeElement(345, {
      type: 'input',
      name: 'name',
    }))
    .toThrow();

  engine.changeElement(lastId!, {
    type: 'input',
    name: 'name',
  });

  const actualMap = getElementsFromEngine(engine);
  const elementForCheck = actualMap.get(lastId);

  // ASSERT
  const ids = getIdsFromEachNode(actualMap.get(1) as any);
  const uniqueNotEmptyIds = new Set(ids.filter(x => x));
  expect(uniqueNotEmptyIds.size).toBe(6);
  expect(elementForCheck?.type).toBe('input');
  expect(elementForCheck?.type).toBe('input');
  expect((elementForCheck as any).name).toBe('name');

  [1, 3, 4, 5, 6].forEach(x => expect(oldMap.get(x)).not.toBe(actualMap.get(x)));
  expect(oldMap.get(2)).toBe(actualMap.get(2));

  checkThatInnerElementsWasUpdated([1, 3, 4, 5], innerElementsCollection as any, actualMap);
  checkNotChangedNodes([2], oldMap, innerElementsCollection as any, actualMap);
});

test('SHOULD edit root element in a schema', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const elementToEditId = oldMap.get(1)?.[idProperty] ?? 0;
  const innerElementsCollection = getInnerElementsCollections(oldMap);

  engine.changeElement(elementToEditId, {
    type: 'input',
    name: 'name',
  });

  const actualMap = getElementsFromEngine(engine);
  const elementForCheck = actualMap.get(elementToEditId);

  // ASSERT
  const ids = getIdsFromEachNode(actualMap.get(1) as any);
  const uniqueNotEmptyIds = new Set(ids.filter(x => x));
  expect(uniqueNotEmptyIds.size).toBe(6);
  expect(elementForCheck?.type).toBe('input');
  expect((elementForCheck as any).name).toBe('name');

  [1].forEach(x => expect(oldMap.get(x)).not.toBe(actualMap.get(x)));
  [2, 3, 4, 5, 6].forEach(x => expect(oldMap.get(x)).toBe(actualMap.get(x)));

  checkNotChangedNodes([2, 3, 4, 5, 6], oldMap, innerElementsCollection as any, actualMap);
});

test('SHOUL', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const lastId = oldMap.get(6)?.[idProperty] ?? 0;
  const elementIdToRemove = oldMap.get(4)?.[idProperty] ?? 0;
  const innerElementsCollection = getInnerElementsCollections(oldMap);

  expect(() =>
    engine.changeElement(lastId, {
      type: 'input',
      name: 'name',
      innerElements: [],
    }))
    .toThrow();

  engine.changeElement(lastId, {
    type: 'input',
    name: 'name',
  });

  engine.changeElement(lastId, {
    type: 'input',
    name: 'name',
  });

  const elementToInsert = {
    type: 'input' as const,
    innerElements: [],
  };

  const indexToInsert = 0;

  engine.addElement(
    elementToInsert,
    indexToInsert,
    lastId);

  engine.removeElement(elementIdToRemove);

  const actualMap = getElementsFromEngine(engine);
  const elementForCheck = actualMap.get(lastId);

  // ASSERT
  const ids = getIdsFromEachNode(actualMap.get(1) as any);
  const uniqueNotEmptyIds = new Set(ids.filter(x => x));
  expect(uniqueNotEmptyIds.size).toBe(3);
  expect(elementForCheck).toBe(undefined);

  [1, 3].forEach(x => expect(oldMap.get(x)).not.toBe(actualMap.get(x)));
  expect(oldMap.get(2)).toBe(actualMap.get(2));

  checkThatInnerElementsWasUpdated([1, 3,], innerElementsCollection as any, actualMap);
  checkNotChangedNodes([2], oldMap, innerElementsCollection as any, actualMap);
});

test('SHOUL1', () => {
  const [engine, oldMap] = getEngineAndTreeMap();
  const lastId = oldMap.get(6)?.[idProperty] ?? 0;
  const elementIdToRemove = oldMap.get(4)?.[idProperty] ?? 0;
  const innerElementsCollection = getInnerElementsCollections(oldMap);

  engine.changeElement(lastId, {
    type: 'input',
    name: 'name',
  });

  const elementToInsert = {
    type: 'input' as const,
    innerElements: [],
  };

  const indexToInsert = 0;

  engine.addElement(
    elementToInsert,
    indexToInsert,
    lastId);

  engine.removeElement(elementIdToRemove);
  getElementsFromEngine(engine);

  engine.addElement({
    [testId]: 4,
    type: 'dropdown',
    innerElements: [
      {
        [testId]: 5,
        type: 'input',
        innerElements: [
          {
            [testId]: 6,
            type: 'dropdown',
            innerElements: [],
          },
        ],
      },
    ],
  },
    0,
    oldMap.get(3)?.[idProperty] ?? 0);

  const actualMap = getElementsFromEngine(engine);

  // ASSERT
  const ids = getIdsFromEachNode(actualMap.get(1) as any);
  const uniqueNotEmptyIds = new Set(ids.filter(x => x));

  expect(uniqueNotEmptyIds.size).toBe(6);

  checkThatNodesWasUpdated([1, 3, 4, 5, 6], oldMap, innerElementsCollection, actualMap);
  checkNotChangedNodes([2], oldMap, innerElementsCollection, actualMap);
});

test('Should execute validators', () => {
  expect(() => new Engine<ITestDataBase>(getConfig(),
    getWorkTreeWithParentElement,
    [() => false]
  ))
    .not
    .toThrow();

  expect(() => new Engine<ITestDataBase>(getConfig(),
    getWorkTreeWithParentElement,
    [() => ({
      errorMessage: "",
      idOfElementWithError: 0,
    })]
  ))
    .toThrow();
});
