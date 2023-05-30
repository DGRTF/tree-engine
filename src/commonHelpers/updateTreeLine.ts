import { IInputTreeNode, parent, TreeWithIdAndParent, idProperty } from "../core/coreModels/IElement";
import { getEnumerableTreeObjectByPropertyWithMethods } from "./elementsTreeToHashMap";

const isElementChanged = Symbol();

export default function updateTreeLines<TElementType extends { innerElements: TElementType[] }>
  (elements: readonly TreeWithIdAndParent<TElementType>[]) {
  let root: TreeWithIdAndParent<TElementType> | undefined = undefined;

  elements.forEach(x => {
    const returnedRoot = updateTreeLine(x)

    if (returnedRoot)
      root = returnedRoot;
  });

  if (root)
    removeIsElementChangedUnnecessaryProperty(root);

  return root ? { ...root as any as TreeWithIdAndParent<TElementType> } : root;
}

const updateTreeLine =
  <TElementType extends IInputTreeNode<TElementType>>
    (element: TreeWithIdAndParent<TElementType>): TreeWithIdAndParent<TElementType> | undefined => {

    if (!element[parent] || element[isElementChanged]) {
      if (!element[parent])
        return element;

      return;
    }

    element.innerElements = element.innerElements.map(x => x);
    updateElementAndParentCollection(element);

    return updateTreeLine(element[parent]!);
  }

const updateElementAndParentCollection =
  <TElementType extends IInputTreeNode<TElementType>>
    (element: TreeWithIdAndParent<TElementType>) =>
    element[parent]!.innerElements = element[parent]!.innerElements
      .map(x => x[idProperty] === element[idProperty] ? { ...x } : x);

const removeIsElementChangedUnnecessaryProperty =
  <TElementType extends IInputTreeNode<TElementType>>
    (root: TreeWithIdAndParent<TElementType>) => {
    getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
      .enumerableForEach(x => delete x[isElementChanged]);
  }
