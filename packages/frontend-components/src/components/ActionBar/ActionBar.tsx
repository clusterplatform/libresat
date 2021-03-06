import * as React from "react";
import { HorizontalScrollSegment } from "../HorizontalScrollSegment";
import { Help } from "../Help/Help";
import { ActionBarButton } from "./ActionBarButton";
import { ActionBarInput } from "./ActionBarInput";
import { IActionBarProps } from "../../types";

const ActionBar = ({ create, search, ...otherProps }: IActionBarProps) => (
  <HorizontalScrollSegment {...otherProps}>
    <Help {...create.help}>
      <ActionBarButton
        icon={create.icon}
        content={create.title}
        onClick={create.onCreate}
        disabled={create.disabled}
      />
    </Help>
    <Help {...search.help}>
      <ActionBarInput
        action={{
          icon: search.icon,
          onClick: search.onSearch,
          disabled: search.disabled
        }}
        placeholder={search.text}
        onChange={search.onSearch}
        value={search.value}
        disabled={search.disabled}
      />
    </Help>
  </HorizontalScrollSegment>
);

export { ActionBar };
