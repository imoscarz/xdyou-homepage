import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

import ts from "typescript";

// Exercise the component's real event handlers with focus/pointer sequences.
// No browser is assumed: Safari may leave document.activeElement outside a tapped link.
const source = readFileSync(
  new URL(
    "../src/components/project/download-card-client.tsx",
    import.meta.url,
  ),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
function mount() {
  let open = false;
  const link = {};
  const outside = {};
  const root = {
    contains: (node) => node === link,
    querySelector: () => ({ focus() {} }),
  };
  const listeners = new Map();
  const effects = [];
  const document = {
    activeElement: outside,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  };
  const window = {
    location: { hash: "" },
    matchMedia: () => ({ matches: false }),
    addEventListener() {},
    removeEventListener() {},
  };
  const jsx = (type, props) => ({ type, props });
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    document,
    window,
    require: (name) => {
      if (name === "react")
        return {
          useState: () => [
            open,
            (value) => {
              open = typeof value === "function" ? value(open) : value;
            },
          ],
          useRef: () => ({ current: root }),
          useEffect: (fn) => effects.push(fn),
        };
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (name === "@/components/icons")
        return { Icons: { smartphone() {}, chevrondown() {} } };
      if (name === "@/lib/utils")
        return { cn: (...args) => args.filter(Boolean).join(" ") };
      if (name === "next/image") return { default() {} };
      throw new Error(name);
    },
  });
  function render() {
    effects.length = 0;
    const tree = testModule.exports.default({
      id: "android",
      name: "Android",
      icon: "smartphone",
      children: "download link",
    });
    effects.forEach((fn) => fn());
    const [trigger, panel] = tree.props.children.props.children;
    return { handlers: tree.props, trigger: trigger.props, panel: panel.props };
  }
  return { render, link, outside, root, document, listeners };
}

test("touch and pen release plus null blur keep download links interactive until click", () => {
  for (const pointerType of ["touch", "pen"]) {
    const card = mount();
    card.render().trigger.onClick({ detail: 1 });
    let view = card.render();
    assert.equal(view.panel.inert, false);
    // Pointerdown on the link is inside; some browsers then blur the trigger.
    card.listeners.get("pointerdown")({ target: card.link });
    view.handlers.onBlurCapture({
      currentTarget: card.root,
      relatedTarget: null,
    });
    view.handlers.onPointerLeave({ pointerType });
    view = card.render();
    assert.equal(view.trigger["aria-expanded"], true);
    assert.equal(
      view.panel.inert,
      false,
      "download must still accept the ensuing native click",
    );
    card.listeners.get("pointerdown")({ target: card.outside });
    assert.equal(card.render().panel.inert, true);
  }
});

test("mouse, keyboard focus, Escape and explicit toggle still dismiss correctly", () => {
  const card = mount();
  card.render().handlers.onPointerEnter({ pointerType: "mouse" });
  assert.equal(card.render().panel.inert, false);
  card.document.activeElement = card.link;
  card.render().handlers.onPointerLeave({ pointerType: "mouse" });
  assert.equal(card.render().panel.inert, false);
  card
    .render()
    .handlers.onBlurCapture({
      currentTarget: card.root,
      relatedTarget: card.outside,
    });
  assert.equal(card.render().panel.inert, true);
  card.render().trigger.onClick({ detail: 1 });
  card.render().handlers.onKeyDown({ key: "Escape", stopPropagation() {} });
  assert.equal(card.render().panel.inert, true);
  card.render().trigger.onClick({ detail: 1 });
  card.document.activeElement = card.outside;
  card.render().handlers.onPointerLeave({ pointerType: "mouse" });
  assert.equal(card.render().panel.inert, true);
  card.render().trigger.onClick({ detail: 1 });
  card.render().trigger.onClick({ detail: 1 });
  assert.equal(card.render().panel.inert, true);
});
