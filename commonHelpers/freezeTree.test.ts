import { freezeTree, unfreezeTree } from "./freezeTree";
import getTree from "../commonHelpers/commonForTests";
import { getEnumerableTreeObjectByPropertyWithMethods } from "./elementsTreeToHashMap";
import { idProperty, innerElementsPropertyName, parent } from "../core/coreModels/IElement";

test('SHOULD freeze container with child and all properties is not writable', () => {
  const tree = getTree();
  freezeTree(tree);

  getEnumerableTreeObjectByPropertyWithMethods(tree, x => x.innerElements)
    .enumerableForEach(treeNode => [...Object.keys(treeNode), ...Object.getOwnPropertySymbols(treeNode)]
      .forEach(key => {
        const isWritable = Object.getOwnPropertyDescriptor(treeNode, key)?.writable;

        if (key === innerElementsPropertyName)
          expect(Object.isFrozen(treeNode[key])).toBe(true);

        expect(isWritable).toBe(false);
      })
    );
});

test('SHOULD all properties is not writable', () => {
  const tree = getTree();
  freezeTree(tree);
  unfreezeTree(tree);

  getEnumerableTreeObjectByPropertyWithMethods(tree, x => x.innerElements)
    .enumerableForEach(treeNode => [...Object.keys(treeNode), ...Object.getOwnPropertySymbols(treeNode)]
      .forEach(key => {
        const isWritable = Object.getOwnPropertyDescriptor(treeNode, key)?.writable;

        if (key === innerElementsPropertyName) {
          expect(Object.isFrozen(treeNode[key])).toBe(true);
          return;
        }

        if (key === parent) {
          expect(isWritable).toBe(true);
          return;
        }

        expect(isWritable).toBe(false);
      })
    );
});
