import { IInputTreeNode, idProperty, parent, TreeWithIdReadonly, TreeWithIdAndParent } from "../coreModels/IElement";

export default
  <TElementType extends IInputTreeNode<TElementType>, TObjectToEdit extends {}>(
    editCommands: Readonly<Map<number, readonly TObjectToEdit[]>>,
    getElement: (elementId: number) => TreeWithIdAndParent<TElementType>) => {

    let rootElementToChange: TreeWithIdAndParent<TElementType> | undefined;

    for (const changes of editCommands) {
      const element = getElement(changes[0]);
      const newElement = changes[1].reduce((x: TreeWithIdAndParent<TElementType>, y) => ({ ...x, ...y }), element);

      if (!element[parent])
        rootElementToChange = newElement;

      if (element[parent])
        changeOldElementToNewEditElementInParentCollection(element, newElement);

    };

    return rootElementToChange ?? false;
  }

const changeOldElementToNewEditElementInParentCollection =
  <TElementType extends IInputTreeNode<TElementType>>
    (element: TreeWithIdAndParent<TElementType>,
      newElement: TreeWithIdAndParent<TElementType>) => {

    // const index = 
    element[parent]!.innerElements = element[parent]!.innerElements.map(x => x[idProperty] === newElement[idProperty] ? newElement : x);
    // element[parent]!.innerElements[index] = newElement;
  }
