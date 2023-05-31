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

  if (root) {
    const newElement = { ...root as any as TreeWithIdAndParent<TElementType> };
    newElement.innerElements.forEach(x => x[parent] = newElement);
    root = newElement;
  }

  return root;
}

const updateTreeLine =
  <TElementType extends IInputTreeNode<TElementType>>
    (element: TreeWithIdAndParent<TElementType>): TreeWithIdAndParent<TElementType> | undefined => {

    if (!element[parent] || element[isElementChanged]) {
      if (!element[parent])
        return element;

      return;
    }

    updateElementAndParentCollection(element);
    element[isElementChanged] = true;

    return updateTreeLine(element[parent]);
  }

const updateElementAndParentCollection =
  <TElementType extends IInputTreeNode<TElementType>>
    (element: TreeWithIdAndParent<TElementType>) =>
    element[parent]!.innerElements = element[parent]!.innerElements
      .map(x => {
        if (x[idProperty] === element[idProperty]) {
          const newElement = { ...x };
          newElement.innerElements = newElement.innerElements.map(y => (y[parent] = newElement, y));

          return newElement;
        }

        return x;
      });

const removeIsElementChangedUnnecessaryProperty =
  <TElementType extends IInputTreeNode<TElementType>>
    (root: TreeWithIdAndParent<TElementType>) => {
    getEnumerableTreeObjectByPropertyWithMethods(root, x => x.innerElements)
      .enumerableForEach(x => delete x[isElementChanged]);
  }
