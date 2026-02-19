"use client";

import * as React from "react";
import { NativeSelect } from "@/components/ui/native-select";

/**
 * Select shim: replaces Radix Select with a stable native <select>.
 * This eliminates portal + scroll-lock + focus/positioning side-effects (page "jumping").
 *
 * API compatibility:
 * - <Select value onValueChange> is supported.
 * - <SelectTrigger>, <SelectValue>, <SelectContent>, <SelectItem> supported enough
 *   for your current usage pattern in LeadForm (and similar).
 *
 * Notes:
 * - SelectContent/Item are rendered as <option>s inside the select.
 * - Styling comes from NativeSelect (input-arch + chevron).
 */

type RootCtx = {
  value: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
};

const Ctx = React.createContext<RootCtx | null>(null);

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  // keep signature compatible even if unused
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function collectOptions(children: React.ReactNode): React.ReactElement[] {
  const options: React.ReactElement[] = [];

  const walk = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return;

      const typeAny = child.type as any;

      if (typeAny?.__CF_SELECT_ITEM === true) {
        options.push(child);
        return;
      }

      // Recurse into children to find SelectItem nodes inside SelectContent
      if (child.props?.children) walk(child.props.children);
    });
  };

  walk(children);
  return options;
}

export function Select({ value = "", onValueChange, children }: SelectProps) {
  // Extract SelectValue placeholder if present
  let placeholder: string | undefined;

  const findPlaceholder = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return;
      const typeAny = child.type as any;

      if (typeAny?.__CF_SELECT_VALUE === true && typeof child.props?.placeholder === "string") {
        placeholder = child.props.placeholder;
        return;
      }
      if (child.props?.children) findPlaceholder(child.props.children);
    });
  };

  findPlaceholder(children);

  const items = collectOptions(children);

  return (
    <Ctx.Provider value={{ value, onValueChange, placeholder }}>
      <NativeSelect
        className="input-arch"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
      >
        {/* placeholder option */}
        <option value="" disabled>
          {placeholder ?? "Select"}
        </option>

        {items.map((el) => {
          const v = el.props.value as string;
          return (
            <option key={v} value={v}>
              {el.props.children}
            </option>
          );
        })}
      </NativeSelect>

      {/* render nothing else; Trigger/Content are just config in this shim */}
      <span className="hidden">{children}</span>
    </Ctx.Provider>
  );
}

export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectTrigger(props: React.HTMLAttributes<HTMLDivElement>) {
  // not used in native mode — Select renders the control
  return <div {...props} className="hidden" />;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  // options are collected by Select
  return <>{children}</>;
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

export function SelectItem(_props: SelectItemProps) {
  // marker component; real rendering happens inside Select
  return null as any;
}
(SelectItem as any).__CF_SELECT_ITEM = true;

type SelectValueProps = { placeholder?: string };
export function SelectValue(_props: SelectValueProps) {
  // marker component for placeholder
  return null as any;
}
(SelectValue as any).__CF_SELECT_VALUE = true;

export function SelectLabel({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectSeparator() {
  return null;
}

export function SelectScrollUpButton() {
  return null;
}

export function SelectScrollDownButton() {
  return null;
}
