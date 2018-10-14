import * as React from "react";
import { Popup, Input } from "semantic-ui-react";
import { HelpPopupHeader } from "./HelpPopupHeader";
import { HelpDocsLink } from "./HelpDocsLink";
import { HelpAccordion } from "./HelpAccordion";
import { IHelpProps } from "../../../types";

const Help = ({ title, text, docsLink, command, trigger }: IHelpProps) => (
  <Popup hoverable flowing trigger={trigger}>
    <HelpPopupHeader>
      {title} <HelpDocsLink href={docsLink}>Docs</HelpDocsLink>
    </HelpPopupHeader>
    <Popup.Content>
      {text}
      <br />
      <HelpAccordion
        panels={[
          {
            title: "Terminal",
            key: 1,
            content: {
              content: (
                <Input
                  label={command[0]} // $ or #
                  value={command.substring(2)}
                />
              )
            }
          }
        ]}
      />
    </Popup.Content>
  </Popup>
);

export { Help };