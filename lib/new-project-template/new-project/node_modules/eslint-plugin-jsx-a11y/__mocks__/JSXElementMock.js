export default function JSXElementMock (tagName, attributes) {
  return {
    type: 'JSXElement',
    openingElement: {
      type: 'JSXOpeningElement',
      name: {
        type: 'JSXIdentifier',
        name: tagName
      },
      attributes,
    },
  };
}
