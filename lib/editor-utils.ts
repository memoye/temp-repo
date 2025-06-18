import type { ElementNode, RangeSelection, TextNode } from "lexical";
import type { SerializedDocument } from "@lexical/file";
import { $isAtNodeEnd } from "@lexical/selection";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function* generateReader<T = any>(reader: ReadableStreamDefaultReader<T>) {
  let done = false;
  while (!done) {
    const res = await reader.read();
    const { value } = res;
    if (value !== undefined) {
      yield value;
    }
    done = res.done;
  }
}

async function readBytestoString(reader: ReadableStreamDefaultReader): Promise<string> {
  const output = [];
  const chunkSize = 0x8000;
  for await (const value of generateReader(reader)) {
    for (let i = 0; i < value.length; i += chunkSize) {
      output.push(String.fromCharCode(...value.subarray(i, i + chunkSize)));
    }
  }
  return output.join("");
}

export async function docToHash(doc: SerializedDocument): Promise<string> {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  const [, output] = await Promise.all([
    writer.write(new TextEncoder().encode(JSON.stringify(doc))).then(() => writer.close()),
    readBytestoString(cs.readable.getReader()),
  ]);
  return `#doc=${btoa(output).replace(/\//g, "_").replace(/\+/g, "-").replace(/=+$/, "")}`;
}

export async function docFromHash(hash: string): Promise<SerializedDocument | null> {
  const m = /^#doc=(.*)$/.exec(hash);
  if (!m) {
    return null;
  }
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  const b64 = atob(m[1].replace(/_/g, "/").replace(/-/g, "+"));
  const array = new Uint8Array(b64.length);
  for (let i = 0; i < b64.length; i++) {
    array[i] = b64.charCodeAt(i);
  }
  const closed = writer.write(array).then(() => writer.close());
  const output = [];
  for await (const chunk of generateReader(
    ds.readable.pipeThrough(new TextDecoderStream()).getReader(),
  )) {
    output.push(chunk);
  }
  await closed;
  return JSON.parse(output.join(""));
}

const SUPPORTED_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "sms:", "tel:"]);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // eslint-disable-next-line no-script-url
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
}

// Source: https://stackoverflow.com/a/8234912/2013580
const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
export function validateUrl(url: string): boolean {
  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.
  return url === "https://" || urlRegExp.test(url);
}

export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

export function getDOMRangeRect(
  nativeSelection: Selection,
  rootElement: HTMLElement,
): DOMRect {
  const domRange = nativeSelection.getRangeAt(0);

  let rect;

  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild as HTMLElement;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }

  return rect;
}

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

export function setFloatingElemPosition(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  isLink: boolean = false,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
): void {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - floatingElemRect.height - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    // adjusted height for link element if the element is at top
    top += floatingElemRect.height + targetRect.height + verticalGap * (isLink ? 9 : 2);
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

export function setFloatingElemPositionForLinkEditor(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
): void {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}
