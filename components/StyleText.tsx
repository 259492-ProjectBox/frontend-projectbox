import parse, { domToReact, Element, Text, DOMNode } from "html-react-parser";

export const StyledText = ({ text }: { text: string | null}) => {
    if(!text) return <></>;
    return parse(text.toString(), {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.name === "p" && domNode.attribs.class === "pdf-content") {
          // Handle the text inside the <p class="pdf-content"> tag
          if (domNode.children) {
            return (
              <p className="pdf-content" style={{ display: "inline"}}>
                {domToReact(domNode.children as DOMNode[], {
                  replace: (child: DOMNode, index: number) => {
                    if (child instanceof Text) {
                      const text = child.data.trim();
                      return (
                        <p key={index} style={{ backgroundColor: "#FCF55F", padding: "1px", display: "inline" }}>
                          {text}
                        </p>
                      );
                    }
                    return child;
                  }
                })}
              </p>
            );
          }
          return <></>; // Remove <p> tag if no children
        }
        if (domNode instanceof Text) {
          return domNode.data; // Return normal text as is
        }
      },
    });
  };