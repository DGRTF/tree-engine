import Engine, { IEngine } from "./core/adminCore/core";
import setParentIdToElements from "./commonHelpers/getWorkTreeWithParentElement";

class Input {
  readonly type: 'input' = 'input';

  innerElements: ElementType[] = [];
  input = '1234';
}

class DropdownElement {
  readonly type: 'dropdown' = 'dropdown';

  innerElements: ElementType[] = [];
  name = 234;
}

// const y: IElement<ElementType> = new DropdownElement(1);

// y.innerElementsWithParent.forEach(x => {
//   if (x.type === 'input')
//     x.input;

//   if (x.type === 'dropdown')
//     x.name
// });
// const idProperty = Symbol();


// const i: TTT<ElementType, "innerElements"> = null as any;
// if (i.type === "dropdown")
//   i.name;
// i.innerElements.
//   if(i.type === "input")
// i.input;

type ElementType = Input | DropdownElement;

export const engine: IEngine<ElementType> = new Engine<ElementType>(
  {
    type: 'dropdown' as const,
    innerElements: [
      {
        type: 'input' as const,
        innerElements: [],
        input: '234',
      }],
    name: 123,
  },
  setParentIdToElements,
  []
);

const element = engine.getElements();
if (!element)
  throw new Error();

if (element.type === 'dropdown') {
  element.name;
  element.innerElements;
}
