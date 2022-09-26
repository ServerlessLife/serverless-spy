"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@popperjs/core/dist/cjs/popper.js
var require_popper = __commonJS({
  "node_modules/@popperjs/core/dist/cjs/popper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getWindow(node) {
      if (node == null) {
        return window;
      }
      if (node.toString() !== "[object Window]") {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }
      return node;
    }
    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }
    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }
    function isShadowRoot(node) {
      if (typeof ShadowRoot === "undefined") {
        return false;
      }
      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    var max = Math.max;
    var min = Math.min;
    var round = Math.round;
    function getUAString() {
      var uaData = navigator.userAgentData;
      if (uaData != null && uaData.brands) {
        return uaData.brands.map(function(item) {
          return item.brand + "/" + item.version;
        }).join(" ");
      }
      return navigator.userAgent;
    }
    function isLayoutViewport() {
      return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
      if (includeScale === void 0) {
        includeScale = false;
      }
      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }
      var clientRect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;
      if (includeScale && isHTMLElement(element)) {
        scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
      }
      var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
      var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
      var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
      var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
      var width = clientRect.width / scaleX;
      var height = clientRect.height / scaleY;
      return {
        width,
        height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x,
        y
      };
    }
    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft,
        scrollTop
      };
    }
    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }
    function getNodeName(element) {
      return element ? (element.nodeName || "").toLowerCase() : null;
    }
    function getDocumentElement(element) {
      return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
    }
    function getWindowScrollBarX(element) {
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }
    function getComputedStyle2(element) {
      return getWindow(element).getComputedStyle(element);
    }
    function isScrollParent(element) {
      var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    }
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }
      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };
      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }
        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }
      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }
    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element);
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }
      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }
      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width,
        height
      };
    }
    function getParentNode(element) {
      if (getNodeName(element) === "html") {
        return element;
      }
      return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
    }
    function getScrollParent(node) {
      if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
        return node.ownerDocument.body;
      }
      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }
      return getScrollParent(getParentNode(node));
    }
    function listScrollParents(element, list2) {
      var _element$ownerDocumen;
      if (list2 === void 0) {
        list2 = [];
      }
      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list2.concat(target);
      return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
    }
    function isTableElement(element) {
      return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
    }
    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
        return null;
      }
      return element.offsetParent;
    }
    function getContainingBlock(element) {
      var isFirefox = /firefox/i.test(getUAString());
      var isIE = /Trident/i.test(getUAString());
      if (isIE && isHTMLElement(element)) {
        var elementCss = getComputedStyle2(element);
        if (elementCss.position === "fixed") {
          return null;
        }
      }
      var currentNode = getParentNode(element);
      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }
      while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle2(currentNode);
        if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }
      return null;
    }
    function getOffsetParent(element) {
      var window2 = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);
      while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
        offsetParent = getTrueOffsetParent(offsetParent);
      }
      if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
        return window2;
      }
      return offsetParent || getContainingBlock(element) || window2;
    }
    var top = "top";
    var bottom = "bottom";
    var right = "right";
    var left = "left";
    var auto = "auto";
    var basePlacements = [top, bottom, right, left];
    var start = "start";
    var end = "end";
    var clippingParents = "clippingParents";
    var viewport = "viewport";
    var popper = "popper";
    var reference = "reference";
    var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []);
    var beforeRead = "beforeRead";
    var read = "read";
    var afterRead = "afterRead";
    var beforeMain = "beforeMain";
    var main = "main";
    var afterMain = "afterMain";
    var beforeWrite = "beforeWrite";
    var write = "write";
    var afterWrite = "afterWrite";
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
    function order(modifiers) {
      var map = /* @__PURE__ */ new Map();
      var visited = /* @__PURE__ */ new Set();
      var result = [];
      modifiers.forEach(function(modifier) {
        map.set(modifier.name, modifier);
      });
      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function(dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);
            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }
      modifiers.forEach(function(modifier) {
        if (!visited.has(modifier.name)) {
          sort(modifier);
        }
      });
      return result;
    }
    function orderModifiers(modifiers) {
      var orderedModifiers = order(modifiers);
      return modifierPhases.reduce(function(acc, phase) {
        return acc.concat(orderedModifiers.filter(function(modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }
    function debounce(fn) {
      var pending;
      return function() {
        if (!pending) {
          pending = new Promise(function(resolve) {
            Promise.resolve().then(function() {
              pending = void 0;
              resolve(fn());
            });
          });
        }
        return pending;
      };
    }
    function format(str) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return [].concat(args).reduce(function(p, c) {
        return p.replace(/%s/, c);
      }, str);
    }
    var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
    var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
    var VALID_PROPERTIES = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
    function validateModifiers(modifiers) {
      modifiers.forEach(function(modifier) {
        [].concat(Object.keys(modifier), VALID_PROPERTIES).filter(function(value, index, self2) {
          return self2.indexOf(value) === index;
        }).forEach(function(key) {
          switch (key) {
            case "name":
              if (typeof modifier.name !== "string") {
                console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', '"' + String(modifier.name) + '"'));
              }
              break;
            case "enabled":
              if (typeof modifier.enabled !== "boolean") {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', '"' + String(modifier.enabled) + '"'));
              }
              break;
            case "phase":
              if (modifierPhases.indexOf(modifier.phase) < 0) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(", "), '"' + String(modifier.phase) + '"'));
              }
              break;
            case "fn":
              if (typeof modifier.fn !== "function") {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', '"' + String(modifier.fn) + '"'));
              }
              break;
            case "effect":
              if (modifier.effect != null && typeof modifier.effect !== "function") {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', '"' + String(modifier.fn) + '"'));
              }
              break;
            case "requires":
              if (modifier.requires != null && !Array.isArray(modifier.requires)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', '"' + String(modifier.requires) + '"'));
              }
              break;
            case "requiresIfExists":
              if (!Array.isArray(modifier.requiresIfExists)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', '"' + String(modifier.requiresIfExists) + '"'));
              }
              break;
            case "options":
            case "data":
              break;
            default:
              console.error('PopperJS: an invalid property has been provided to the "' + modifier.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function(s) {
                return '"' + s + '"';
              }).join(", ") + '; but "' + key + '" was provided.');
          }
          modifier.requires && modifier.requires.forEach(function(requirement) {
            if (modifiers.find(function(mod) {
              return mod.name === requirement;
            }) == null) {
              console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
            }
          });
        });
      });
    }
    function uniqueBy(arr, fn) {
      var identifiers = /* @__PURE__ */ new Set();
      return arr.filter(function(item) {
        var identifier = fn(item);
        if (!identifiers.has(identifier)) {
          identifiers.add(identifier);
          return true;
        }
      });
    }
    function getBasePlacement(placement) {
      return placement.split("-")[0];
    }
    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function(merged2, current) {
        var existing = merged2[current.name];
        merged2[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged2;
      }, {});
      return Object.keys(merged).map(function(key) {
        return merged[key];
      });
    }
    function getViewportRect(element, strategy) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0;
      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = isLayoutViewport();
        if (layoutViewport || !layoutViewport && strategy === "fixed") {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }
      return {
        width,
        height,
        x: x + getWindowScrollBarX(element),
        y
      };
    }
    function getDocumentRect(element) {
      var _element$ownerDocumen;
      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;
      if (getComputedStyle2(body || html).direction === "rtl") {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }
      return {
        width,
        height,
        x,
        y
      };
    }
    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode();
      if (parent.contains(child)) {
        return true;
      } else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;
        do {
          if (next && parent.isSameNode(next)) {
            return true;
          }
          next = next.parentNode || next.host;
        } while (next);
      }
      return false;
    }
    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }
    function getInnerBoundingClientRect(element, strategy) {
      var rect = getBoundingClientRect(element, false, strategy === "fixed");
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }
    function getClientRectFromMixedType(element, clippingParent, strategy) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    function getClippingParents(element) {
      var clippingParents2 = listScrollParents(getParentNode(element));
      var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
      if (!isElement(clipperElement)) {
        return [];
      }
      return clippingParents2.filter(function(clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
      });
    }
    function getClippingRect(element, boundary, rootBoundary, strategy) {
      var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
      var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents2[0];
      var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent, strategy));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }
    function getVariation(placement) {
      return placement.split("-")[1];
    }
    function getMainAxisFromPlacement(placement) {
      return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
    }
    function computeOffsets(_ref) {
      var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference2.x + reference2.width / 2 - element.width / 2;
      var commonY = reference2.y + reference2.height / 2 - element.height / 2;
      var offsets;
      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference2.y - element.height
          };
          break;
        case bottom:
          offsets = {
            x: commonX,
            y: reference2.y + reference2.height
          };
          break;
        case right:
          offsets = {
            x: reference2.x + reference2.width,
            y: commonY
          };
          break;
        case left:
          offsets = {
            x: reference2.x - element.width,
            y: commonY
          };
          break;
        default:
          offsets = {
            x: reference2.x,
            y: reference2.y
          };
      }
      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
      if (mainAxis != null) {
        var len = mainAxis === "y" ? "height" : "width";
        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
            break;
          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
            break;
        }
      }
      return offsets;
    }
    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }
    function expandToHashMap(value, keys) {
      return keys.reduce(function(hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }
    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }
      var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets2 = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: "absolute",
        placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset;
      if (elementContext === popper && offsetData) {
        var offset2 = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function(key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
          overflowOffsets[key] += offset2[axis] * multiply;
        });
      }
      return overflowOffsets;
    }
    var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
    var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
    var DEFAULT_OPTIONS = {
      placement: "bottom",
      modifiers: [],
      strategy: "absolute"
    };
    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return !args.some(function(element) {
        return !(element && typeof element.getBoundingClientRect === "function");
      });
    }
    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }
      var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper2(reference2, popper2, options) {
        if (options === void 0) {
          options = defaultOptions;
        }
        var state = {
          placement: "bottom",
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference2,
            popper: popper2
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state,
          setOptions: function setOptions(setOptionsAction) {
            var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options2);
            state.scrollParents = {
              reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
              popper: listScrollParents(popper2)
            };
            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
            state.orderedModifiers = orderedModifiers.filter(function(m) {
              return m.enabled;
            });
            if (process.env.NODE_ENV !== "production") {
              var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function(_ref) {
                var name = _ref.name;
                return name;
              });
              validateModifiers(modifiers);
              if (getBasePlacement(state.options.placement) === auto) {
                var flipModifier = state.orderedModifiers.find(function(_ref2) {
                  var name = _ref2.name;
                  return name === "flip";
                });
                if (!flipModifier) {
                  console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
                }
              }
              var _getComputedStyle = getComputedStyle2(popper2), marginTop = _getComputedStyle.marginTop, marginRight = _getComputedStyle.marginRight, marginBottom = _getComputedStyle.marginBottom, marginLeft = _getComputedStyle.marginLeft;
              if ([marginTop, marginRight, marginBottom, marginLeft].some(function(margin) {
                return parseFloat(margin);
              })) {
                console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
              }
            }
            runModifierEffects();
            return instance.update();
          },
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }
            var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
            if (!areValidElements(reference3, popper3)) {
              if (process.env.NODE_ENV !== "production") {
                console.error(INVALID_ELEMENT_ERROR);
              }
              return;
            }
            state.rects = {
              reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
              popper: getLayoutRect(popper3)
            };
            state.reset = false;
            state.placement = state.options.placement;
            state.orderedModifiers.forEach(function(modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });
            var __debug_loops__ = 0;
            for (var index = 0; index < state.orderedModifiers.length; index++) {
              if (process.env.NODE_ENV !== "production") {
                __debug_loops__ += 1;
                if (__debug_loops__ > 100) {
                  console.error(INFINITE_LOOP_ERROR);
                  break;
                }
              }
              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }
              var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
              if (typeof fn === "function") {
                state = fn({
                  state,
                  options: _options,
                  name,
                  instance
                }) || state;
              }
            }
          },
          update: debounce(function() {
            return new Promise(function(resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };
        if (!areValidElements(reference2, popper2)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }
          return instance;
        }
        instance.setOptions(options).then(function(state2) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state2);
          }
        });
        function runModifierEffects() {
          state.orderedModifiers.forEach(function(_ref3) {
            var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
            if (typeof effect2 === "function") {
              var cleanupFn = effect2({
                state,
                name,
                instance,
                options: options2
              });
              var noopFn = function noopFn2() {
              };
              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }
        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function(fn) {
            return fn();
          });
          effectCleanupFns = [];
        }
        return instance;
      };
    }
    var passive = {
      passive: true
    };
    function effect$2(_ref) {
      var state = _ref.state, instance = _ref.instance, options = _ref.options;
      var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
      var window2 = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.addEventListener("scroll", instance.update, passive);
        });
      }
      if (resize) {
        window2.addEventListener("resize", instance.update, passive);
      }
      return function() {
        if (scroll) {
          scrollParents.forEach(function(scrollParent) {
            scrollParent.removeEventListener("scroll", instance.update, passive);
          });
        }
        if (resize) {
          window2.removeEventListener("resize", instance.update, passive);
        }
      };
    }
    var eventListeners = {
      name: "eventListeners",
      enabled: true,
      phase: "write",
      fn: function fn() {
      },
      effect: effect$2,
      data: {}
    };
    function popperOffsets(_ref) {
      var state = _ref.state, name = _ref.name;
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: "absolute",
        placement: state.placement
      });
    }
    var popperOffsets$1 = {
      name: "popperOffsets",
      enabled: true,
      phase: "read",
      fn: popperOffsets,
      data: {}
    };
    var unsetSides = {
      top: "auto",
      right: "auto",
      bottom: "auto",
      left: "auto"
    };
    function roundOffsetsByDPR(_ref) {
      var x = _ref.x, y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }
    function mapToStyles(_ref2) {
      var _Object$assign2;
      var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
      var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
        x,
        y
      }) : {
        x,
        y
      };
      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty("x");
      var hasY = offsets.hasOwnProperty("y");
      var sideX = left;
      var sideY = top;
      var win = window;
      if (adaptive) {
        var offsetParent = getOffsetParent(popper2);
        var heightProp = "clientHeight";
        var widthProp = "clientWidth";
        if (offsetParent === getWindow(popper2)) {
          offsetParent = getDocumentElement(popper2);
          if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
            heightProp = "scrollHeight";
            widthProp = "scrollWidth";
          }
        }
        offsetParent = offsetParent;
        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }
        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }
      var commonStyles = Object.assign({
        position
      }, adaptive && unsetSides);
      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x,
        y
      }) : {
        x,
        y
      };
      x = _ref4.x;
      y = _ref4.y;
      if (gpuAcceleration) {
        var _Object$assign;
        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }
      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
    }
    function computeStyles(_ref5) {
      var state = _ref5.state, options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
      if (process.env.NODE_ENV !== "production") {
        var transitionProperty = getComputedStyle2(state.elements.popper).transitionProperty || "";
        if (adaptive && ["transform", "top", "right", "bottom", "left"].some(function(property) {
          return transitionProperty.indexOf(property) >= 0;
        })) {
          console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
        }
      }
      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration,
        isFixed: state.options.strategy === "fixed"
      };
      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive,
          roundOffsets
        })));
      }
      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: "absolute",
          adaptive: false,
          roundOffsets
        })));
      }
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        "data-popper-placement": state.placement
      });
    }
    var computeStyles$1 = {
      name: "computeStyles",
      enabled: true,
      phase: "beforeWrite",
      fn: computeStyles,
      data: {}
    };
    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function(name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name];
        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(name2) {
          var value = attributes[name2];
          if (value === false) {
            element.removeAttribute(name2);
          } else {
            element.setAttribute(name2, value === true ? "" : value);
          }
        });
      });
    }
    function effect$1(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: "0",
          top: "0",
          margin: "0"
        },
        arrow: {
          position: "absolute"
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;
      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }
      return function() {
        Object.keys(state.elements).forEach(function(name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
          var style = styleProperties.reduce(function(style2, property) {
            style2[property] = "";
            return style2;
          }, {});
          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }
          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function(attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    }
    var applyStyles$1 = {
      name: "applyStyles",
      enabled: true,
      phase: "write",
      fn: applyStyles,
      effect: effect$1,
      requires: ["computeStyles"]
    };
    function distanceAndSkiddingToXY(placement, rects, offset2) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
      var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
        placement
      })) : offset2, skidding = _ref[0], distance = _ref[1];
      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }
    function offset(_ref2) {
      var state = _ref2.state, options = _ref2.options, name = _ref2.name;
      var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function(acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }
      state.modifiersData[name] = data;
    }
    var offset$1 = {
      name: "offset",
      enabled: true,
      phase: "main",
      requires: ["popperOffsets"],
      fn: offset
    };
    var hash$1 = {
      left: "right",
      right: "left",
      bottom: "top",
      top: "bottom"
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function(matched) {
        return hash$1[matched];
      });
    }
    var hash = {
      start: "end",
      end: "start"
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function(matched) {
        return hash[matched];
      });
    }
    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }
      var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
        return getVariation(placement2) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function(placement2) {
        return allowedAutoPlacements.indexOf(placement2) >= 0;
      });
      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;
        if (process.env.NODE_ENV !== "production") {
          console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" "));
        }
      }
      var overflows = allowedPlacements.reduce(function(acc, placement2) {
        acc[placement2] = detectOverflow(state, {
          placement: placement2,
          boundary,
          rootBoundary,
          padding
        })[getBasePlacement(placement2)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function(a, b) {
        return overflows[a] - overflows[b];
      });
    }
    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }
      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }
    function flip(_ref) {
      var state = _ref.state, options = _ref.options, name = _ref.name;
      if (state.modifiersData[name]._skip) {
        return;
      }
      var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
        return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
          placement: placement2,
          boundary,
          rootBoundary,
          padding,
          flipVariations,
          allowedAutoPlacements
        }) : placement2);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = /* @__PURE__ */ new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements2[0];
      for (var i = 0; i < placements2.length; i++) {
        var placement = placements2[i];
        var _basePlacement = getBasePlacement(placement);
        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? "width" : "height";
        var overflow = detectOverflow(state, {
          placement,
          boundary,
          rootBoundary,
          altBoundary,
          padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }
        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];
        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }
        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }
        if (checks.every(function(check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }
        checksMap.set(placement, checks);
      }
      if (makeFallbackChecks) {
        var numberOfChecks = flipVariations ? 3 : 1;
        var _loop = function _loop2(_i2) {
          var fittingPlacement = placements2.find(function(placement2) {
            var checks2 = checksMap.get(placement2);
            if (checks2) {
              return checks2.slice(0, _i2).every(function(check) {
                return check;
              });
            }
          });
          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };
        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);
          if (_ret === "break")
            break;
        }
      }
      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    }
    var flip$1 = {
      name: "flip",
      enabled: true,
      phase: "main",
      fn: flip,
      requiresIfExists: ["offset"],
      data: {
        _skip: false
      }
    };
    function getAltAxis(axis) {
      return axis === "x" ? "y" : "x";
    }
    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min2, value, max2) {
      var v = within(min2, value, max2);
      return v > max2 ? max2 : v;
    }
    function preventOverflow(_ref) {
      var state = _ref.state, options = _ref.options, name = _ref.name;
      var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary,
        rootBoundary,
        padding,
        altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets2 = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };
      if (!popperOffsets2) {
        return;
      }
      if (checkMainAxis) {
        var _offsetModifierState$;
        var mainSide = mainAxis === "y" ? top : left;
        var altSide = mainAxis === "y" ? bottom : right;
        var len = mainAxis === "y" ? "height" : "width";
        var offset2 = popperOffsets2[mainAxis];
        var min$1 = offset2 + overflow[mainSide];
        var max$1 = offset2 - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide];
        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset2 + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets2[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset2;
      }
      if (checkAltAxis) {
        var _offsetModifierState$2;
        var _mainSide = mainAxis === "x" ? top : left;
        var _altSide = mainAxis === "x" ? bottom : right;
        var _offset = popperOffsets2[altAxis];
        var _len = altAxis === "y" ? "height" : "width";
        var _min = _offset + overflow[_mainSide];
        var _max = _offset - overflow[_altSide];
        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
        popperOffsets2[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }
      state.modifiersData[name] = data;
    }
    var preventOverflow$1 = {
      name: "preventOverflow",
      enabled: true,
      phase: "main",
      fn: preventOverflow,
      requiresIfExists: ["offset"]
    };
    var toPaddingObject = function toPaddingObject2(padding, state) {
      padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    };
    function arrow(_ref) {
      var _state$modifiersData$;
      var state = _ref.state, name = _ref.name, options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets2 = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? "height" : "width";
      if (!arrowElement || !popperOffsets2) {
        return;
      }
      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === "y" ? top : left;
      var maxProp = axis === "y" ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
      var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2;
      var min2 = paddingObject[minProp];
      var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset2 = within(min2, center, max2);
      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
    }
    function effect(_ref2) {
      var state = _ref2.state, options = _ref2.options;
      var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
      if (arrowElement == null) {
        return;
      }
      if (typeof arrowElement === "string") {
        arrowElement = state.elements.popper.querySelector(arrowElement);
        if (!arrowElement) {
          return;
        }
      }
      if (process.env.NODE_ENV !== "production") {
        if (!isHTMLElement(arrowElement)) {
          console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "));
        }
      }
      if (!contains(state.elements.popper, arrowElement)) {
        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
        }
        return;
      }
      state.elements.arrow = arrowElement;
    }
    var arrow$1 = {
      name: "arrow",
      enabled: true,
      phase: "main",
      fn: arrow,
      effect,
      requires: ["popperOffsets"],
      requiresIfExists: ["preventOverflow"]
    };
    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }
      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }
    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function(side) {
        return overflow[side] >= 0;
      });
    }
    function hide(_ref) {
      var state = _ref.state, name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: "reference"
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets,
        popperEscapeOffsets,
        isReferenceHidden,
        hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        "data-popper-reference-hidden": isReferenceHidden,
        "data-popper-escaped": hasPopperEscaped
      });
    }
    var hide$1 = {
      name: "hide",
      enabled: true,
      phase: "main",
      requiresIfExists: ["preventOverflow"],
      fn: hide
    };
    var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
    var createPopper$1 = /* @__PURE__ */ popperGenerator({
      defaultModifiers: defaultModifiers$1
    });
    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /* @__PURE__ */ popperGenerator({
      defaultModifiers
    });
    exports.applyStyles = applyStyles$1;
    exports.arrow = arrow$1;
    exports.computeStyles = computeStyles$1;
    exports.createPopper = createPopper;
    exports.createPopperLite = createPopper$1;
    exports.defaultModifiers = defaultModifiers;
    exports.detectOverflow = detectOverflow;
    exports.eventListeners = eventListeners;
    exports.flip = flip$1;
    exports.hide = hide$1;
    exports.offset = offset$1;
    exports.popperGenerator = popperGenerator;
    exports.popperOffsets = popperOffsets$1;
    exports.preventOverflow = preventOverflow$1;
  }
});

// node_modules/bootstrap/dist/js/bootstrap.js
var require_bootstrap = __commonJS({
  "node_modules/bootstrap/dist/js/bootstrap.js"(exports, module2) {
    (function(global, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? module2.exports = factory(require_popper()) : typeof define === "function" && define.amd ? define(["@popperjs/core"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.bootstrap = factory(global.Popper));
    })(exports, function(Popper) {
      "use strict";
      function _interopNamespace(e) {
        if (e && e.__esModule)
          return e;
        const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
        if (e) {
          for (const k in e) {
            if (k !== "default") {
              const d = Object.getOwnPropertyDescriptor(e, k);
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: () => e[k]
              });
            }
          }
        }
        n.default = e;
        return Object.freeze(n);
      }
      const Popper__namespace = /* @__PURE__ */ _interopNamespace(Popper);
      const MAX_UID = 1e6;
      const MILLISECONDS_MULTIPLIER = 1e3;
      const TRANSITION_END = "transitionend";
      const toType = (object) => {
        if (object === null || object === void 0) {
          return `${object}`;
        }
        return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
      };
      const getUID = (prefix) => {
        do {
          prefix += Math.floor(Math.random() * MAX_UID);
        } while (document.getElementById(prefix));
        return prefix;
      };
      const getSelector = (element) => {
        let selector = element.getAttribute("data-bs-target");
        if (!selector || selector === "#") {
          let hrefAttribute = element.getAttribute("href");
          if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
            return null;
          }
          if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
            hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
          }
          selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
        }
        return selector;
      };
      const getSelectorFromElement = (element) => {
        const selector = getSelector(element);
        if (selector) {
          return document.querySelector(selector) ? selector : null;
        }
        return null;
      };
      const getElementFromSelector = (element) => {
        const selector = getSelector(element);
        return selector ? document.querySelector(selector) : null;
      };
      const getTransitionDurationFromElement = (element) => {
        if (!element) {
          return 0;
        }
        let {
          transitionDuration,
          transitionDelay
        } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay);
        if (!floatTransitionDuration && !floatTransitionDelay) {
          return 0;
        }
        transitionDuration = transitionDuration.split(",")[0];
        transitionDelay = transitionDelay.split(",")[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
      };
      const triggerTransitionEnd = (element) => {
        element.dispatchEvent(new Event(TRANSITION_END));
      };
      const isElement = (object) => {
        if (!object || typeof object !== "object") {
          return false;
        }
        if (typeof object.jquery !== "undefined") {
          object = object[0];
        }
        return typeof object.nodeType !== "undefined";
      };
      const getElement = (object) => {
        if (isElement(object)) {
          return object.jquery ? object[0] : object;
        }
        if (typeof object === "string" && object.length > 0) {
          return document.querySelector(object);
        }
        return null;
      };
      const isVisible = (element) => {
        if (!isElement(element) || element.getClientRects().length === 0) {
          return false;
        }
        const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
        const closedDetails = element.closest("details:not([open])");
        if (!closedDetails) {
          return elementIsVisible;
        }
        if (closedDetails !== element) {
          const summary = element.closest("summary");
          if (summary && summary.parentNode !== closedDetails) {
            return false;
          }
          if (summary === null) {
            return false;
          }
        }
        return elementIsVisible;
      };
      const isDisabled = (element) => {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          return true;
        }
        if (element.classList.contains("disabled")) {
          return true;
        }
        if (typeof element.disabled !== "undefined") {
          return element.disabled;
        }
        return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
      };
      const findShadowRoot = (element) => {
        if (!document.documentElement.attachShadow) {
          return null;
        }
        if (typeof element.getRootNode === "function") {
          const root = element.getRootNode();
          return root instanceof ShadowRoot ? root : null;
        }
        if (element instanceof ShadowRoot) {
          return element;
        }
        if (!element.parentNode) {
          return null;
        }
        return findShadowRoot(element.parentNode);
      };
      const noop = () => {
      };
      const reflow = (element) => {
        element.offsetHeight;
      };
      const getjQuery = () => {
        if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
          return window.jQuery;
        }
        return null;
      };
      const DOMContentLoadedCallbacks = [];
      const onDOMContentLoaded = (callback) => {
        if (document.readyState === "loading") {
          if (!DOMContentLoadedCallbacks.length) {
            document.addEventListener("DOMContentLoaded", () => {
              for (const callback2 of DOMContentLoadedCallbacks) {
                callback2();
              }
            });
          }
          DOMContentLoadedCallbacks.push(callback);
        } else {
          callback();
        }
      };
      const isRTL = () => document.documentElement.dir === "rtl";
      const defineJQueryPlugin = (plugin) => {
        onDOMContentLoaded(() => {
          const $ = getjQuery();
          if ($) {
            const name = plugin.NAME;
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;
            $.fn[name].noConflict = () => {
              $.fn[name] = JQUERY_NO_CONFLICT;
              return plugin.jQueryInterface;
            };
          }
        });
      };
      const execute = (callback) => {
        if (typeof callback === "function") {
          callback();
        }
      };
      const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
        if (!waitForTransition) {
          execute(callback);
          return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = ({
          target
        }) => {
          if (target !== transitionElement) {
            return;
          }
          called = true;
          transitionElement.removeEventListener(TRANSITION_END, handler);
          execute(callback);
        };
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(() => {
          if (!called) {
            triggerTransitionEnd(transitionElement);
          }
        }, emulatedDuration);
      };
      const getNextActiveElement = (list2, activeElement, shouldGetNext, isCycleAllowed) => {
        const listLength = list2.length;
        let index = list2.indexOf(activeElement);
        if (index === -1) {
          return !shouldGetNext && isCycleAllowed ? list2[listLength - 1] : list2[0];
        }
        index += shouldGetNext ? 1 : -1;
        if (isCycleAllowed) {
          index = (index + listLength) % listLength;
        }
        return list2[Math.max(0, Math.min(index, listLength - 1))];
      };
      const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
      const stripNameRegex = /\..*/;
      const stripUidRegex = /::\d+$/;
      const eventRegistry = {};
      let uidEvent = 1;
      const customEvents = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
      };
      const nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
      function makeEventUid(element, uid) {
        return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
      }
      function getElementEvents(element) {
        const uid = makeEventUid(element);
        element.uidEvent = uid;
        eventRegistry[uid] = eventRegistry[uid] || {};
        return eventRegistry[uid];
      }
      function bootstrapHandler(element, fn) {
        return function handler(event) {
          hydrateObj(event, {
            delegateTarget: element
          });
          if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
          }
          return fn.apply(element, [event]);
        };
      }
      function bootstrapDelegationHandler(element, selector, fn) {
        return function handler(event) {
          const domElements = element.querySelectorAll(selector);
          for (let {
            target
          } = event; target && target !== this; target = target.parentNode) {
            for (const domElement of domElements) {
              if (domElement !== target) {
                continue;
              }
              hydrateObj(event, {
                delegateTarget: target
              });
              if (handler.oneOff) {
                EventHandler.off(element, event.type, selector, fn);
              }
              return fn.apply(target, [event]);
            }
          }
        };
      }
      function findHandler(events, callable, delegationSelector = null) {
        return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
      }
      function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
        const isDelegated = typeof handler === "string";
        const callable = isDelegated ? delegationFunction : handler || delegationFunction;
        let typeEvent = getTypeEvent(originalTypeEvent);
        if (!nativeEvents.has(typeEvent)) {
          typeEvent = originalTypeEvent;
        }
        return [isDelegated, callable, typeEvent];
      }
      function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
        if (typeof originalTypeEvent !== "string" || !element) {
          return;
        }
        let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        if (originalTypeEvent in customEvents) {
          const wrapFunction = (fn2) => {
            return function(event) {
              if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
                return fn2.call(this, event);
              }
            };
          };
          callable = wrapFunction(callable);
        }
        const events = getElementEvents(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
        if (previousFunction) {
          previousFunction.oneOff = previousFunction.oneOff && oneOff;
          return;
        }
        const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
        const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
        fn.delegationSelector = isDelegated ? handler : null;
        fn.callable = callable;
        fn.oneOff = oneOff;
        fn.uidEvent = uid;
        handlers[uid] = fn;
        element.addEventListener(typeEvent, fn, isDelegated);
      }
      function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);
        if (!fn) {
          return;
        }
        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
      }
      function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        for (const handlerKey of Object.keys(storeElementEvent)) {
          if (handlerKey.includes(namespace)) {
            const event = storeElementEvent[handlerKey];
            removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
          }
        }
      }
      function getTypeEvent(event) {
        event = event.replace(stripNameRegex, "");
        return customEvents[event] || event;
      }
      const EventHandler = {
        on(element, event, handler, delegationFunction) {
          addHandler(element, event, handler, delegationFunction, false);
        },
        one(element, event, handler, delegationFunction) {
          addHandler(element, event, handler, delegationFunction, true);
        },
        off(element, originalTypeEvent, handler, delegationFunction) {
          if (typeof originalTypeEvent !== "string" || !element) {
            return;
          }
          const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
          const inNamespace = typeEvent !== originalTypeEvent;
          const events = getElementEvents(element);
          const storeElementEvent = events[typeEvent] || {};
          const isNamespace = originalTypeEvent.startsWith(".");
          if (typeof callable !== "undefined") {
            if (!Object.keys(storeElementEvent).length) {
              return;
            }
            removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
            return;
          }
          if (isNamespace) {
            for (const elementEvent of Object.keys(events)) {
              removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            }
          }
          for (const keyHandlers of Object.keys(storeElementEvent)) {
            const handlerKey = keyHandlers.replace(stripUidRegex, "");
            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
              const event = storeElementEvent[keyHandlers];
              removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
            }
          }
        },
        trigger(element, event, args) {
          if (typeof event !== "string" || !element) {
            return null;
          }
          const $ = getjQuery();
          const typeEvent = getTypeEvent(event);
          const inNamespace = event !== typeEvent;
          let jQueryEvent = null;
          let bubbles = true;
          let nativeDispatch = true;
          let defaultPrevented = false;
          if (inNamespace && $) {
            jQueryEvent = $.Event(event, args);
            $(element).trigger(jQueryEvent);
            bubbles = !jQueryEvent.isPropagationStopped();
            nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
            defaultPrevented = jQueryEvent.isDefaultPrevented();
          }
          let evt = new Event(event, {
            bubbles,
            cancelable: true
          });
          evt = hydrateObj(evt, args);
          if (defaultPrevented) {
            evt.preventDefault();
          }
          if (nativeDispatch) {
            element.dispatchEvent(evt);
          }
          if (evt.defaultPrevented && jQueryEvent) {
            jQueryEvent.preventDefault();
          }
          return evt;
        }
      };
      function hydrateObj(obj, meta) {
        for (const [key, value] of Object.entries(meta || {})) {
          try {
            obj[key] = value;
          } catch (_unused) {
            Object.defineProperty(obj, key, {
              configurable: true,
              get() {
                return value;
              }
            });
          }
        }
        return obj;
      }
      const elementMap = /* @__PURE__ */ new Map();
      const Data = {
        set(element, key, instance) {
          if (!elementMap.has(element)) {
            elementMap.set(element, /* @__PURE__ */ new Map());
          }
          const instanceMap = elementMap.get(element);
          if (!instanceMap.has(key) && instanceMap.size !== 0) {
            console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
            return;
          }
          instanceMap.set(key, instance);
        },
        get(element, key) {
          if (elementMap.has(element)) {
            return elementMap.get(element).get(key) || null;
          }
          return null;
        },
        remove(element, key) {
          if (!elementMap.has(element)) {
            return;
          }
          const instanceMap = elementMap.get(element);
          instanceMap.delete(key);
          if (instanceMap.size === 0) {
            elementMap.delete(element);
          }
        }
      };
      function normalizeData(value) {
        if (value === "true") {
          return true;
        }
        if (value === "false") {
          return false;
        }
        if (value === Number(value).toString()) {
          return Number(value);
        }
        if (value === "" || value === "null") {
          return null;
        }
        if (typeof value !== "string") {
          return value;
        }
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (_unused) {
          return value;
        }
      }
      function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
      }
      const Manipulator = {
        setDataAttribute(element, key, value) {
          element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },
        removeDataAttribute(element, key) {
          element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },
        getDataAttributes(element) {
          if (!element) {
            return {};
          }
          const attributes = {};
          const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
          for (const key of bsKeys) {
            let pureKey = key.replace(/^bs/, "");
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
            attributes[pureKey] = normalizeData(element.dataset[key]);
          }
          return attributes;
        },
        getDataAttribute(element, key) {
          return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        }
      };
      class Config {
        static get Default() {
          return {};
        }
        static get DefaultType() {
          return {};
        }
        static get NAME() {
          throw new Error('You have to implement the static method "NAME", for each component!');
        }
        _getConfig(config) {
          config = this._mergeConfigObj(config);
          config = this._configAfterMerge(config);
          this._typeCheckConfig(config);
          return config;
        }
        _configAfterMerge(config) {
          return config;
        }
        _mergeConfigObj(config, element) {
          const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
          return {
            ...this.constructor.Default,
            ...typeof jsonConfig === "object" ? jsonConfig : {},
            ...isElement(element) ? Manipulator.getDataAttributes(element) : {},
            ...typeof config === "object" ? config : {}
          };
        }
        _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
          for (const property of Object.keys(configTypes)) {
            const expectedTypes = configTypes[property];
            const value = config[property];
            const valueType = isElement(value) ? "element" : toType(value);
            if (!new RegExp(expectedTypes).test(valueType)) {
              throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
            }
          }
        }
      }
      const VERSION = "5.2.1";
      class BaseComponent extends Config {
        constructor(element, config) {
          super();
          element = getElement(element);
          if (!element) {
            return;
          }
          this._element = element;
          this._config = this._getConfig(config);
          Data.set(this._element, this.constructor.DATA_KEY, this);
        }
        dispose() {
          Data.remove(this._element, this.constructor.DATA_KEY);
          EventHandler.off(this._element, this.constructor.EVENT_KEY);
          for (const propertyName of Object.getOwnPropertyNames(this)) {
            this[propertyName] = null;
          }
        }
        _queueCallback(callback, element, isAnimated = true) {
          executeAfterTransition(callback, element, isAnimated);
        }
        _getConfig(config) {
          config = this._mergeConfigObj(config, this._element);
          config = this._configAfterMerge(config);
          this._typeCheckConfig(config);
          return config;
        }
        static getInstance(element) {
          return Data.get(getElement(element), this.DATA_KEY);
        }
        static getOrCreateInstance(element, config = {}) {
          return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
        }
        static get VERSION() {
          return VERSION;
        }
        static get DATA_KEY() {
          return `bs.${this.NAME}`;
        }
        static get EVENT_KEY() {
          return `.${this.DATA_KEY}`;
        }
        static eventName(name) {
          return `${name}${this.EVENT_KEY}`;
        }
      }
      const enableDismissTrigger = (component, method = "hide") => {
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
          if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
          }
          if (isDisabled(this)) {
            return;
          }
          const target = getElementFromSelector(this) || this.closest(`.${name}`);
          const instance = component.getOrCreateInstance(target);
          instance[method]();
        });
      };
      const NAME$f = "alert";
      const DATA_KEY$a = "bs.alert";
      const EVENT_KEY$b = `.${DATA_KEY$a}`;
      const EVENT_CLOSE = `close${EVENT_KEY$b}`;
      const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
      const CLASS_NAME_FADE$5 = "fade";
      const CLASS_NAME_SHOW$8 = "show";
      class Alert extends BaseComponent {
        static get NAME() {
          return NAME$f;
        }
        close() {
          const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
          if (closeEvent.defaultPrevented) {
            return;
          }
          this._element.classList.remove(CLASS_NAME_SHOW$8);
          const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
          this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
        }
        _destroyElement() {
          this._element.remove();
          EventHandler.trigger(this._element, EVENT_CLOSED);
          this.dispose();
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Alert.getOrCreateInstance(this);
            if (typeof config !== "string") {
              return;
            }
            if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config](this);
          });
        }
      }
      enableDismissTrigger(Alert, "close");
      defineJQueryPlugin(Alert);
      const NAME$e = "button";
      const DATA_KEY$9 = "bs.button";
      const EVENT_KEY$a = `.${DATA_KEY$9}`;
      const DATA_API_KEY$6 = ".data-api";
      const CLASS_NAME_ACTIVE$3 = "active";
      const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
      const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
      class Button extends BaseComponent {
        static get NAME() {
          return NAME$e;
        }
        toggle() {
          this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Button.getOrCreateInstance(this);
            if (config === "toggle") {
              data[config]();
            }
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, (event) => {
        event.preventDefault();
        const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
        const data = Button.getOrCreateInstance(button);
        data.toggle();
      });
      defineJQueryPlugin(Button);
      const SelectorEngine = {
        find(selector, element = document.documentElement) {
          return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },
        findOne(selector, element = document.documentElement) {
          return Element.prototype.querySelector.call(element, selector);
        },
        children(element, selector) {
          return [].concat(...element.children).filter((child) => child.matches(selector));
        },
        parents(element, selector) {
          const parents = [];
          let ancestor = element.parentNode.closest(selector);
          while (ancestor) {
            parents.push(ancestor);
            ancestor = ancestor.parentNode.closest(selector);
          }
          return parents;
        },
        prev(element, selector) {
          let previous = element.previousElementSibling;
          while (previous) {
            if (previous.matches(selector)) {
              return [previous];
            }
            previous = previous.previousElementSibling;
          }
          return [];
        },
        next(element, selector) {
          let next = element.nextElementSibling;
          while (next) {
            if (next.matches(selector)) {
              return [next];
            }
            next = next.nextElementSibling;
          }
          return [];
        },
        focusableChildren(element) {
          const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
          return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el));
        }
      };
      const NAME$d = "swipe";
      const EVENT_KEY$9 = ".bs.swipe";
      const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
      const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
      const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
      const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
      const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
      const POINTER_TYPE_TOUCH = "touch";
      const POINTER_TYPE_PEN = "pen";
      const CLASS_NAME_POINTER_EVENT = "pointer-event";
      const SWIPE_THRESHOLD = 40;
      const Default$c = {
        endCallback: null,
        leftCallback: null,
        rightCallback: null
      };
      const DefaultType$c = {
        endCallback: "(function|null)",
        leftCallback: "(function|null)",
        rightCallback: "(function|null)"
      };
      class Swipe extends Config {
        constructor(element, config) {
          super();
          this._element = element;
          if (!element || !Swipe.isSupported()) {
            return;
          }
          this._config = this._getConfig(config);
          this._deltaX = 0;
          this._supportPointerEvents = Boolean(window.PointerEvent);
          this._initEvents();
        }
        static get Default() {
          return Default$c;
        }
        static get DefaultType() {
          return DefaultType$c;
        }
        static get NAME() {
          return NAME$d;
        }
        dispose() {
          EventHandler.off(this._element, EVENT_KEY$9);
        }
        _start(event) {
          if (!this._supportPointerEvents) {
            this._deltaX = event.touches[0].clientX;
            return;
          }
          if (this._eventIsPointerPenTouch(event)) {
            this._deltaX = event.clientX;
          }
        }
        _end(event) {
          if (this._eventIsPointerPenTouch(event)) {
            this._deltaX = event.clientX - this._deltaX;
          }
          this._handleSwipe();
          execute(this._config.endCallback);
        }
        _move(event) {
          this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
        }
        _handleSwipe() {
          const absDeltaX = Math.abs(this._deltaX);
          if (absDeltaX <= SWIPE_THRESHOLD) {
            return;
          }
          const direction = absDeltaX / this._deltaX;
          this._deltaX = 0;
          if (!direction) {
            return;
          }
          execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
        }
        _initEvents() {
          if (this._supportPointerEvents) {
            EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
            EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
            this._element.classList.add(CLASS_NAME_POINTER_EVENT);
          } else {
            EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
            EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
            EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
          }
        }
        _eventIsPointerPenTouch(event) {
          return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
        }
        static isSupported() {
          return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
        }
      }
      const NAME$c = "carousel";
      const DATA_KEY$8 = "bs.carousel";
      const EVENT_KEY$8 = `.${DATA_KEY$8}`;
      const DATA_API_KEY$5 = ".data-api";
      const ARROW_LEFT_KEY$1 = "ArrowLeft";
      const ARROW_RIGHT_KEY$1 = "ArrowRight";
      const TOUCHEVENT_COMPAT_WAIT = 500;
      const ORDER_NEXT = "next";
      const ORDER_PREV = "prev";
      const DIRECTION_LEFT = "left";
      const DIRECTION_RIGHT = "right";
      const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
      const EVENT_SLID = `slid${EVENT_KEY$8}`;
      const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
      const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
      const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
      const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
      const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
      const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
      const CLASS_NAME_CAROUSEL = "carousel";
      const CLASS_NAME_ACTIVE$2 = "active";
      const CLASS_NAME_SLIDE = "slide";
      const CLASS_NAME_END = "carousel-item-end";
      const CLASS_NAME_START = "carousel-item-start";
      const CLASS_NAME_NEXT = "carousel-item-next";
      const CLASS_NAME_PREV = "carousel-item-prev";
      const SELECTOR_ACTIVE = ".active";
      const SELECTOR_ITEM = ".carousel-item";
      const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
      const SELECTOR_ITEM_IMG = ".carousel-item img";
      const SELECTOR_INDICATORS = ".carousel-indicators";
      const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
      const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
      const KEY_TO_DIRECTION = {
        [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
        [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
      };
      const Default$b = {
        interval: 5e3,
        keyboard: true,
        pause: "hover",
        ride: false,
        touch: true,
        wrap: true
      };
      const DefaultType$b = {
        interval: "(number|boolean)",
        keyboard: "boolean",
        pause: "(string|boolean)",
        ride: "(boolean|string)",
        touch: "boolean",
        wrap: "boolean"
      };
      class Carousel extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._interval = null;
          this._activeElement = null;
          this._isSliding = false;
          this.touchTimeout = null;
          this._swipeHelper = null;
          this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
          this._addEventListeners();
          if (this._config.ride === CLASS_NAME_CAROUSEL) {
            this.cycle();
          }
        }
        static get Default() {
          return Default$b;
        }
        static get DefaultType() {
          return DefaultType$b;
        }
        static get NAME() {
          return NAME$c;
        }
        next() {
          this._slide(ORDER_NEXT);
        }
        nextWhenVisible() {
          if (!document.hidden && isVisible(this._element)) {
            this.next();
          }
        }
        prev() {
          this._slide(ORDER_PREV);
        }
        pause() {
          if (this._isSliding) {
            triggerTransitionEnd(this._element);
          }
          this._clearInterval();
        }
        cycle() {
          this._clearInterval();
          this._updateInterval();
          this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
        }
        _maybeEnableCycle() {
          if (!this._config.ride) {
            return;
          }
          if (this._isSliding) {
            EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
            return;
          }
          this.cycle();
        }
        to(index) {
          const items = this._getItems();
          if (index > items.length - 1 || index < 0) {
            return;
          }
          if (this._isSliding) {
            EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
            return;
          }
          const activeIndex = this._getItemIndex(this._getActive());
          if (activeIndex === index) {
            return;
          }
          const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
          this._slide(order, items[index]);
        }
        dispose() {
          if (this._swipeHelper) {
            this._swipeHelper.dispose();
          }
          super.dispose();
        }
        _configAfterMerge(config) {
          config.defaultInterval = config.interval;
          return config;
        }
        _addEventListeners() {
          if (this._config.keyboard) {
            EventHandler.on(this._element, EVENT_KEYDOWN$1, (event) => this._keydown(event));
          }
          if (this._config.pause === "hover") {
            EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
            EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
          }
          if (this._config.touch && Swipe.isSupported()) {
            this._addTouchEventListeners();
          }
        }
        _addTouchEventListeners() {
          for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
            EventHandler.on(img, EVENT_DRAG_START, (event) => event.preventDefault());
          }
          const endCallBack = () => {
            if (this._config.pause !== "hover") {
              return;
            }
            this.pause();
            if (this.touchTimeout) {
              clearTimeout(this.touchTimeout);
            }
            this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
          };
          const swipeConfig = {
            leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
            rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
            endCallback: endCallBack
          };
          this._swipeHelper = new Swipe(this._element, swipeConfig);
        }
        _keydown(event) {
          if (/input|textarea/i.test(event.target.tagName)) {
            return;
          }
          const direction = KEY_TO_DIRECTION[event.key];
          if (direction) {
            event.preventDefault();
            this._slide(this._directionToOrder(direction));
          }
        }
        _getItemIndex(element) {
          return this._getItems().indexOf(element);
        }
        _setActiveIndicatorElement(index) {
          if (!this._indicatorsElement) {
            return;
          }
          const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
          activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
          activeIndicator.removeAttribute("aria-current");
          const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
          if (newActiveIndicator) {
            newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
            newActiveIndicator.setAttribute("aria-current", "true");
          }
        }
        _updateInterval() {
          const element = this._activeElement || this._getActive();
          if (!element) {
            return;
          }
          const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
          this._config.interval = elementInterval || this._config.defaultInterval;
        }
        _slide(order, element = null) {
          if (this._isSliding) {
            return;
          }
          const activeElement = this._getActive();
          const isNext = order === ORDER_NEXT;
          const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
          if (nextElement === activeElement) {
            return;
          }
          const nextElementIndex = this._getItemIndex(nextElement);
          const triggerEvent = (eventName) => {
            return EventHandler.trigger(this._element, eventName, {
              relatedTarget: nextElement,
              direction: this._orderToDirection(order),
              from: this._getItemIndex(activeElement),
              to: nextElementIndex
            });
          };
          const slideEvent = triggerEvent(EVENT_SLIDE);
          if (slideEvent.defaultPrevented) {
            return;
          }
          if (!activeElement || !nextElement) {
            return;
          }
          const isCycling = Boolean(this._interval);
          this.pause();
          this._isSliding = true;
          this._setActiveIndicatorElement(nextElementIndex);
          this._activeElement = nextElement;
          const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
          const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
          nextElement.classList.add(orderClassName);
          reflow(nextElement);
          activeElement.classList.add(directionalClassName);
          nextElement.classList.add(directionalClassName);
          const completeCallBack = () => {
            nextElement.classList.remove(directionalClassName, orderClassName);
            nextElement.classList.add(CLASS_NAME_ACTIVE$2);
            activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
            this._isSliding = false;
            triggerEvent(EVENT_SLID);
          };
          this._queueCallback(completeCallBack, activeElement, this._isAnimated());
          if (isCycling) {
            this.cycle();
          }
        }
        _isAnimated() {
          return this._element.classList.contains(CLASS_NAME_SLIDE);
        }
        _getActive() {
          return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
        }
        _getItems() {
          return SelectorEngine.find(SELECTOR_ITEM, this._element);
        }
        _clearInterval() {
          if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
          }
        }
        _directionToOrder(direction) {
          if (isRTL()) {
            return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
          }
          return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
        }
        _orderToDirection(order) {
          if (isRTL()) {
            return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }
          return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Carousel.getOrCreateInstance(this, config);
            if (typeof config === "number") {
              data.to(config);
              return;
            }
            if (typeof config === "string") {
              if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
                throw new TypeError(`No method named "${config}"`);
              }
              data[config]();
            }
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function(event) {
        const target = getElementFromSelector(this);
        if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
          return;
        }
        event.preventDefault();
        const carousel = Carousel.getOrCreateInstance(target);
        const slideIndex = this.getAttribute("data-bs-slide-to");
        if (slideIndex) {
          carousel.to(slideIndex);
          carousel._maybeEnableCycle();
          return;
        }
        if (Manipulator.getDataAttribute(this, "slide") === "next") {
          carousel.next();
          carousel._maybeEnableCycle();
          return;
        }
        carousel.prev();
        carousel._maybeEnableCycle();
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
        const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
        for (const carousel of carousels) {
          Carousel.getOrCreateInstance(carousel);
        }
      });
      defineJQueryPlugin(Carousel);
      const NAME$b = "collapse";
      const DATA_KEY$7 = "bs.collapse";
      const EVENT_KEY$7 = `.${DATA_KEY$7}`;
      const DATA_API_KEY$4 = ".data-api";
      const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
      const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
      const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
      const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
      const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
      const CLASS_NAME_SHOW$7 = "show";
      const CLASS_NAME_COLLAPSE = "collapse";
      const CLASS_NAME_COLLAPSING = "collapsing";
      const CLASS_NAME_COLLAPSED = "collapsed";
      const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
      const CLASS_NAME_HORIZONTAL = "collapse-horizontal";
      const WIDTH = "width";
      const HEIGHT = "height";
      const SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing";
      const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
      const Default$a = {
        parent: null,
        toggle: true
      };
      const DefaultType$a = {
        parent: "(null|element)",
        toggle: "boolean"
      };
      class Collapse extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._isTransitioning = false;
          this._triggerArray = [];
          const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
          for (const elem of toggleList) {
            const selector = getSelectorFromElement(elem);
            const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
            if (selector !== null && filterElement.length) {
              this._triggerArray.push(elem);
            }
          }
          this._initializeChildren();
          if (!this._config.parent) {
            this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
          }
          if (this._config.toggle) {
            this.toggle();
          }
        }
        static get Default() {
          return Default$a;
        }
        static get DefaultType() {
          return DefaultType$a;
        }
        static get NAME() {
          return NAME$b;
        }
        toggle() {
          if (this._isShown()) {
            this.hide();
          } else {
            this.show();
          }
        }
        show() {
          if (this._isTransitioning || this._isShown()) {
            return;
          }
          let activeChildren = [];
          if (this._config.parent) {
            activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element).map((element) => Collapse.getOrCreateInstance(element, {
              toggle: false
            }));
          }
          if (activeChildren.length && activeChildren[0]._isTransitioning) {
            return;
          }
          const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
          if (startEvent.defaultPrevented) {
            return;
          }
          for (const activeInstance of activeChildren) {
            activeInstance.hide();
          }
          const dimension = this._getDimension();
          this._element.classList.remove(CLASS_NAME_COLLAPSE);
          this._element.classList.add(CLASS_NAME_COLLAPSING);
          this._element.style[dimension] = 0;
          this._addAriaAndCollapsedClass(this._triggerArray, true);
          this._isTransitioning = true;
          const complete = () => {
            this._isTransitioning = false;
            this._element.classList.remove(CLASS_NAME_COLLAPSING);
            this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
            this._element.style[dimension] = "";
            EventHandler.trigger(this._element, EVENT_SHOWN$6);
          };
          const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
          const scrollSize = `scroll${capitalizedDimension}`;
          this._queueCallback(complete, this._element, true);
          this._element.style[dimension] = `${this._element[scrollSize]}px`;
        }
        hide() {
          if (this._isTransitioning || !this._isShown()) {
            return;
          }
          const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
          if (startEvent.defaultPrevented) {
            return;
          }
          const dimension = this._getDimension();
          this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
          reflow(this._element);
          this._element.classList.add(CLASS_NAME_COLLAPSING);
          this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
          for (const trigger of this._triggerArray) {
            const element = getElementFromSelector(trigger);
            if (element && !this._isShown(element)) {
              this._addAriaAndCollapsedClass([trigger], false);
            }
          }
          this._isTransitioning = true;
          const complete = () => {
            this._isTransitioning = false;
            this._element.classList.remove(CLASS_NAME_COLLAPSING);
            this._element.classList.add(CLASS_NAME_COLLAPSE);
            EventHandler.trigger(this._element, EVENT_HIDDEN$6);
          };
          this._element.style[dimension] = "";
          this._queueCallback(complete, this._element, true);
        }
        _isShown(element = this._element) {
          return element.classList.contains(CLASS_NAME_SHOW$7);
        }
        _configAfterMerge(config) {
          config.toggle = Boolean(config.toggle);
          config.parent = getElement(config.parent);
          return config;
        }
        _getDimension() {
          return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
        }
        _initializeChildren() {
          if (!this._config.parent) {
            return;
          }
          const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
          for (const element of children) {
            const selected = getElementFromSelector(element);
            if (selected) {
              this._addAriaAndCollapsedClass([element], this._isShown(selected));
            }
          }
        }
        _getFirstLevelChildren(selector) {
          const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
          return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
        }
        _addAriaAndCollapsedClass(triggerArray, isOpen) {
          if (!triggerArray.length) {
            return;
          }
          for (const element of triggerArray) {
            element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
            element.setAttribute("aria-expanded", isOpen);
          }
        }
        static jQueryInterface(config) {
          const _config = {};
          if (typeof config === "string" && /show|hide/.test(config)) {
            _config.toggle = false;
          }
          return this.each(function() {
            const data = Collapse.getOrCreateInstance(this, _config);
            if (typeof config === "string") {
              if (typeof data[config] === "undefined") {
                throw new TypeError(`No method named "${config}"`);
              }
              data[config]();
            }
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function(event) {
        if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") {
          event.preventDefault();
        }
        const selector = getSelectorFromElement(this);
        const selectorElements = SelectorEngine.find(selector);
        for (const element of selectorElements) {
          Collapse.getOrCreateInstance(element, {
            toggle: false
          }).toggle();
        }
      });
      defineJQueryPlugin(Collapse);
      const NAME$a = "dropdown";
      const DATA_KEY$6 = "bs.dropdown";
      const EVENT_KEY$6 = `.${DATA_KEY$6}`;
      const DATA_API_KEY$3 = ".data-api";
      const ESCAPE_KEY$2 = "Escape";
      const TAB_KEY$1 = "Tab";
      const ARROW_UP_KEY$1 = "ArrowUp";
      const ARROW_DOWN_KEY$1 = "ArrowDown";
      const RIGHT_MOUSE_BUTTON = 2;
      const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
      const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
      const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
      const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
      const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const CLASS_NAME_SHOW$6 = "show";
      const CLASS_NAME_DROPUP = "dropup";
      const CLASS_NAME_DROPEND = "dropend";
      const CLASS_NAME_DROPSTART = "dropstart";
      const CLASS_NAME_DROPUP_CENTER = "dropup-center";
      const CLASS_NAME_DROPDOWN_CENTER = "dropdown-center";
      const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
      const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
      const SELECTOR_MENU = ".dropdown-menu";
      const SELECTOR_NAVBAR = ".navbar";
      const SELECTOR_NAVBAR_NAV = ".navbar-nav";
      const SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
      const PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
      const PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
      const PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
      const PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
      const PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
      const PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";
      const PLACEMENT_TOPCENTER = "top";
      const PLACEMENT_BOTTOMCENTER = "bottom";
      const Default$9 = {
        autoClose: true,
        boundary: "clippingParents",
        display: "dynamic",
        offset: [0, 2],
        popperConfig: null,
        reference: "toggle"
      };
      const DefaultType$9 = {
        autoClose: "(boolean|string)",
        boundary: "(string|element)",
        display: "string",
        offset: "(array|string|function)",
        popperConfig: "(null|object|function)",
        reference: "(string|element|object)"
      };
      class Dropdown extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._popper = null;
          this._parent = this._element.parentNode;
          this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0];
          this._inNavbar = this._detectNavbar();
        }
        static get Default() {
          return Default$9;
        }
        static get DefaultType() {
          return DefaultType$9;
        }
        static get NAME() {
          return NAME$a;
        }
        toggle() {
          return this._isShown() ? this.hide() : this.show();
        }
        show() {
          if (isDisabled(this._element) || this._isShown()) {
            return;
          }
          const relatedTarget = {
            relatedTarget: this._element
          };
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
          if (showEvent.defaultPrevented) {
            return;
          }
          this._createPopper();
          if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.on(element, "mouseover", noop);
            }
          }
          this._element.focus();
          this._element.setAttribute("aria-expanded", true);
          this._menu.classList.add(CLASS_NAME_SHOW$6);
          this._element.classList.add(CLASS_NAME_SHOW$6);
          EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
        }
        hide() {
          if (isDisabled(this._element) || !this._isShown()) {
            return;
          }
          const relatedTarget = {
            relatedTarget: this._element
          };
          this._completeHide(relatedTarget);
        }
        dispose() {
          if (this._popper) {
            this._popper.destroy();
          }
          super.dispose();
        }
        update() {
          this._inNavbar = this._detectNavbar();
          if (this._popper) {
            this._popper.update();
          }
        }
        _completeHide(relatedTarget) {
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
          if (hideEvent.defaultPrevented) {
            return;
          }
          if ("ontouchstart" in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.off(element, "mouseover", noop);
            }
          }
          if (this._popper) {
            this._popper.destroy();
          }
          this._menu.classList.remove(CLASS_NAME_SHOW$6);
          this._element.classList.remove(CLASS_NAME_SHOW$6);
          this._element.setAttribute("aria-expanded", "false");
          Manipulator.removeDataAttribute(this._menu, "popper");
          EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
        }
        _getConfig(config) {
          config = super._getConfig(config);
          if (typeof config.reference === "object" && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== "function") {
            throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
          }
          return config;
        }
        _createPopper() {
          if (typeof Popper__namespace === "undefined") {
            throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
          }
          let referenceElement = this._element;
          if (this._config.reference === "parent") {
            referenceElement = this._parent;
          } else if (isElement(this._config.reference)) {
            referenceElement = getElement(this._config.reference);
          } else if (typeof this._config.reference === "object") {
            referenceElement = this._config.reference;
          }
          const popperConfig = this._getPopperConfig();
          this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
        }
        _isShown() {
          return this._menu.classList.contains(CLASS_NAME_SHOW$6);
        }
        _getPlacement() {
          const parentDropdown = this._parent;
          if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
            return PLACEMENT_RIGHT;
          }
          if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
            return PLACEMENT_LEFT;
          }
          if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
            return PLACEMENT_TOPCENTER;
          }
          if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
            return PLACEMENT_BOTTOMCENTER;
          }
          const isEnd = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
          if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
            return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
          }
          return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
        }
        _detectNavbar() {
          return this._element.closest(SELECTOR_NAVBAR) !== null;
        }
        _getOffset() {
          const {
            offset
          } = this._config;
          if (typeof offset === "string") {
            return offset.split(",").map((value) => Number.parseInt(value, 10));
          }
          if (typeof offset === "function") {
            return (popperData) => offset(popperData, this._element);
          }
          return offset;
        }
        _getPopperConfig() {
          const defaultBsPopperConfig = {
            placement: this._getPlacement(),
            modifiers: [{
              name: "preventOverflow",
              options: {
                boundary: this._config.boundary
              }
            }, {
              name: "offset",
              options: {
                offset: this._getOffset()
              }
            }]
          };
          if (this._inNavbar || this._config.display === "static") {
            Manipulator.setDataAttribute(this._menu, "popper", "static");
            defaultBsPopperConfig.modifiers = [{
              name: "applyStyles",
              enabled: false
            }];
          }
          return {
            ...defaultBsPopperConfig,
            ...typeof this._config.popperConfig === "function" ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
          };
        }
        _selectMenuItem({
          key,
          target
        }) {
          const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((element) => isVisible(element));
          if (!items.length) {
            return;
          }
          getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Dropdown.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
              return;
            }
            if (typeof data[config] === "undefined") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          });
        }
        static clearMenus(event) {
          if (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY$1) {
            return;
          }
          const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
          for (const toggle of openToggles) {
            const context = Dropdown.getInstance(toggle);
            if (!context || context._config.autoClose === false) {
              continue;
            }
            const composedPath = event.composedPath();
            const isMenuTarget = composedPath.includes(context._menu);
            if (composedPath.includes(context._element) || context._config.autoClose === "inside" && !isMenuTarget || context._config.autoClose === "outside" && isMenuTarget) {
              continue;
            }
            if (context._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
              continue;
            }
            const relatedTarget = {
              relatedTarget: context._element
            };
            if (event.type === "click") {
              relatedTarget.clickEvent = event;
            }
            context._completeHide(relatedTarget);
          }
        }
        static dataApiKeydownHandler(event) {
          const isInput = /input|textarea/i.test(event.target.tagName);
          const isEscapeEvent = event.key === ESCAPE_KEY$2;
          const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
          if (!isUpOrDownEvent && !isEscapeEvent) {
            return;
          }
          if (isInput && !isEscapeEvent) {
            return;
          }
          event.preventDefault();
          const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0];
          const instance = Dropdown.getOrCreateInstance(getToggleButton);
          if (isUpOrDownEvent) {
            event.stopPropagation();
            instance.show();
            instance._selectMenuItem(event);
            return;
          }
          if (instance._isShown()) {
            event.stopPropagation();
            instance.hide();
            getToggleButton.focus();
          }
        }
      }
      EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
      EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
      EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
      EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
      EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function(event) {
        event.preventDefault();
        Dropdown.getOrCreateInstance(this).toggle();
      });
      defineJQueryPlugin(Dropdown);
      const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
      const SELECTOR_STICKY_CONTENT = ".sticky-top";
      const PROPERTY_PADDING = "padding-right";
      const PROPERTY_MARGIN = "margin-right";
      class ScrollBarHelper {
        constructor() {
          this._element = document.body;
        }
        getWidth() {
          const documentWidth = document.documentElement.clientWidth;
          return Math.abs(window.innerWidth - documentWidth);
        }
        hide() {
          const width = this.getWidth();
          this._disableOverFlow();
          this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
          this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
          this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
        }
        reset() {
          this._resetElementAttributes(this._element, "overflow");
          this._resetElementAttributes(this._element, PROPERTY_PADDING);
          this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
          this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
        }
        isOverflowing() {
          return this.getWidth() > 0;
        }
        _disableOverFlow() {
          this._saveInitialAttribute(this._element, "overflow");
          this._element.style.overflow = "hidden";
        }
        _setElementAttributes(selector, styleProperty, callback) {
          const scrollbarWidth = this.getWidth();
          const manipulationCallBack = (element) => {
            if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
              return;
            }
            this._saveInitialAttribute(element, styleProperty);
            const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
            element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
          };
          this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _saveInitialAttribute(element, styleProperty) {
          const actualValue = element.style.getPropertyValue(styleProperty);
          if (actualValue) {
            Manipulator.setDataAttribute(element, styleProperty, actualValue);
          }
        }
        _resetElementAttributes(selector, styleProperty) {
          const manipulationCallBack = (element) => {
            const value = Manipulator.getDataAttribute(element, styleProperty);
            if (value === null) {
              element.style.removeProperty(styleProperty);
              return;
            }
            Manipulator.removeDataAttribute(element, styleProperty);
            element.style.setProperty(styleProperty, value);
          };
          this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _applyManipulationCallback(selector, callBack) {
          if (isElement(selector)) {
            callBack(selector);
            return;
          }
          for (const sel of SelectorEngine.find(selector, this._element)) {
            callBack(sel);
          }
        }
      }
      const NAME$9 = "backdrop";
      const CLASS_NAME_FADE$4 = "fade";
      const CLASS_NAME_SHOW$5 = "show";
      const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
      const Default$8 = {
        className: "modal-backdrop",
        clickCallback: null,
        isAnimated: false,
        isVisible: true,
        rootElement: "body"
      };
      const DefaultType$8 = {
        className: "string",
        clickCallback: "(function|null)",
        isAnimated: "boolean",
        isVisible: "boolean",
        rootElement: "(element|string)"
      };
      class Backdrop extends Config {
        constructor(config) {
          super();
          this._config = this._getConfig(config);
          this._isAppended = false;
          this._element = null;
        }
        static get Default() {
          return Default$8;
        }
        static get DefaultType() {
          return DefaultType$8;
        }
        static get NAME() {
          return NAME$9;
        }
        show(callback) {
          if (!this._config.isVisible) {
            execute(callback);
            return;
          }
          this._append();
          const element = this._getElement();
          if (this._config.isAnimated) {
            reflow(element);
          }
          element.classList.add(CLASS_NAME_SHOW$5);
          this._emulateAnimation(() => {
            execute(callback);
          });
        }
        hide(callback) {
          if (!this._config.isVisible) {
            execute(callback);
            return;
          }
          this._getElement().classList.remove(CLASS_NAME_SHOW$5);
          this._emulateAnimation(() => {
            this.dispose();
            execute(callback);
          });
        }
        dispose() {
          if (!this._isAppended) {
            return;
          }
          EventHandler.off(this._element, EVENT_MOUSEDOWN);
          this._element.remove();
          this._isAppended = false;
        }
        _getElement() {
          if (!this._element) {
            const backdrop = document.createElement("div");
            backdrop.className = this._config.className;
            if (this._config.isAnimated) {
              backdrop.classList.add(CLASS_NAME_FADE$4);
            }
            this._element = backdrop;
          }
          return this._element;
        }
        _configAfterMerge(config) {
          config.rootElement = getElement(config.rootElement);
          return config;
        }
        _append() {
          if (this._isAppended) {
            return;
          }
          const element = this._getElement();
          this._config.rootElement.append(element);
          EventHandler.on(element, EVENT_MOUSEDOWN, () => {
            execute(this._config.clickCallback);
          });
          this._isAppended = true;
        }
        _emulateAnimation(callback) {
          executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
        }
      }
      const NAME$8 = "focustrap";
      const DATA_KEY$5 = "bs.focustrap";
      const EVENT_KEY$5 = `.${DATA_KEY$5}`;
      const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
      const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
      const TAB_KEY = "Tab";
      const TAB_NAV_FORWARD = "forward";
      const TAB_NAV_BACKWARD = "backward";
      const Default$7 = {
        autofocus: true,
        trapElement: null
      };
      const DefaultType$7 = {
        autofocus: "boolean",
        trapElement: "element"
      };
      class FocusTrap extends Config {
        constructor(config) {
          super();
          this._config = this._getConfig(config);
          this._isActive = false;
          this._lastTabNavDirection = null;
        }
        static get Default() {
          return Default$7;
        }
        static get DefaultType() {
          return DefaultType$7;
        }
        static get NAME() {
          return NAME$8;
        }
        activate() {
          if (this._isActive) {
            return;
          }
          if (this._config.autofocus) {
            this._config.trapElement.focus();
          }
          EventHandler.off(document, EVENT_KEY$5);
          EventHandler.on(document, EVENT_FOCUSIN$2, (event) => this._handleFocusin(event));
          EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event));
          this._isActive = true;
        }
        deactivate() {
          if (!this._isActive) {
            return;
          }
          this._isActive = false;
          EventHandler.off(document, EVENT_KEY$5);
        }
        _handleFocusin(event) {
          const {
            trapElement
          } = this._config;
          if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
            return;
          }
          const elements = SelectorEngine.focusableChildren(trapElement);
          if (elements.length === 0) {
            trapElement.focus();
          } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
            elements[elements.length - 1].focus();
          } else {
            elements[0].focus();
          }
        }
        _handleKeydown(event) {
          if (event.key !== TAB_KEY) {
            return;
          }
          this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
        }
      }
      const NAME$7 = "modal";
      const DATA_KEY$4 = "bs.modal";
      const EVENT_KEY$4 = `.${DATA_KEY$4}`;
      const DATA_API_KEY$2 = ".data-api";
      const ESCAPE_KEY$1 = "Escape";
      const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
      const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
      const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
      const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
      const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
      const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
      const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
      const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
      const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
      const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
      const CLASS_NAME_OPEN = "modal-open";
      const CLASS_NAME_FADE$3 = "fade";
      const CLASS_NAME_SHOW$4 = "show";
      const CLASS_NAME_STATIC = "modal-static";
      const OPEN_SELECTOR$1 = ".modal.show";
      const SELECTOR_DIALOG = ".modal-dialog";
      const SELECTOR_MODAL_BODY = ".modal-body";
      const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
      const Default$6 = {
        backdrop: true,
        focus: true,
        keyboard: true
      };
      const DefaultType$6 = {
        backdrop: "(boolean|string)",
        focus: "boolean",
        keyboard: "boolean"
      };
      class Modal2 extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
          this._backdrop = this._initializeBackDrop();
          this._focustrap = this._initializeFocusTrap();
          this._isShown = false;
          this._isTransitioning = false;
          this._scrollBar = new ScrollBarHelper();
          this._addEventListeners();
        }
        static get Default() {
          return Default$6;
        }
        static get DefaultType() {
          return DefaultType$6;
        }
        static get NAME() {
          return NAME$7;
        }
        toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }
        show(relatedTarget) {
          if (this._isShown || this._isTransitioning) {
            return;
          }
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
            relatedTarget
          });
          if (showEvent.defaultPrevented) {
            return;
          }
          this._isShown = true;
          this._isTransitioning = true;
          this._scrollBar.hide();
          document.body.classList.add(CLASS_NAME_OPEN);
          this._adjustDialog();
          this._backdrop.show(() => this._showElement(relatedTarget));
        }
        hide() {
          if (!this._isShown || this._isTransitioning) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
          if (hideEvent.defaultPrevented) {
            return;
          }
          this._isShown = false;
          this._isTransitioning = true;
          this._focustrap.deactivate();
          this._element.classList.remove(CLASS_NAME_SHOW$4);
          this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
        }
        dispose() {
          for (const htmlElement of [window, this._dialog]) {
            EventHandler.off(htmlElement, EVENT_KEY$4);
          }
          this._backdrop.dispose();
          this._focustrap.deactivate();
          super.dispose();
        }
        handleUpdate() {
          this._adjustDialog();
        }
        _initializeBackDrop() {
          return new Backdrop({
            isVisible: Boolean(this._config.backdrop),
            isAnimated: this._isAnimated()
          });
        }
        _initializeFocusTrap() {
          return new FocusTrap({
            trapElement: this._element
          });
        }
        _showElement(relatedTarget) {
          if (!document.body.contains(this._element)) {
            document.body.append(this._element);
          }
          this._element.style.display = "block";
          this._element.removeAttribute("aria-hidden");
          this._element.setAttribute("aria-modal", true);
          this._element.setAttribute("role", "dialog");
          this._element.scrollTop = 0;
          const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
          if (modalBody) {
            modalBody.scrollTop = 0;
          }
          reflow(this._element);
          this._element.classList.add(CLASS_NAME_SHOW$4);
          const transitionComplete = () => {
            if (this._config.focus) {
              this._focustrap.activate();
            }
            this._isTransitioning = false;
            EventHandler.trigger(this._element, EVENT_SHOWN$4, {
              relatedTarget
            });
          };
          this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
        }
        _addEventListeners() {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (event) => {
            if (event.key !== ESCAPE_KEY$1) {
              return;
            }
            if (this._config.keyboard) {
              event.preventDefault();
              this.hide();
              return;
            }
            this._triggerBackdropTransition();
          });
          EventHandler.on(window, EVENT_RESIZE$1, () => {
            if (this._isShown && !this._isTransitioning) {
              this._adjustDialog();
            }
          });
          EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event) => {
            EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event2) => {
              if (this._dialog.contains(event.target) || this._dialog.contains(event2.target)) {
                return;
              }
              if (this._config.backdrop === "static") {
                this._triggerBackdropTransition();
                return;
              }
              if (this._config.backdrop) {
                this.hide();
              }
            });
          });
        }
        _hideModal() {
          this._element.style.display = "none";
          this._element.setAttribute("aria-hidden", true);
          this._element.removeAttribute("aria-modal");
          this._element.removeAttribute("role");
          this._isTransitioning = false;
          this._backdrop.hide(() => {
            document.body.classList.remove(CLASS_NAME_OPEN);
            this._resetAdjustments();
            this._scrollBar.reset();
            EventHandler.trigger(this._element, EVENT_HIDDEN$4);
          });
        }
        _isAnimated() {
          return this._element.classList.contains(CLASS_NAME_FADE$3);
        }
        _triggerBackdropTransition() {
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
          if (hideEvent.defaultPrevented) {
            return;
          }
          const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
          const initialOverflowY = this._element.style.overflowY;
          if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) {
            return;
          }
          if (!isModalOverflowing) {
            this._element.style.overflowY = "hidden";
          }
          this._element.classList.add(CLASS_NAME_STATIC);
          this._queueCallback(() => {
            this._element.classList.remove(CLASS_NAME_STATIC);
            this._queueCallback(() => {
              this._element.style.overflowY = initialOverflowY;
            }, this._dialog);
          }, this._dialog);
          this._element.focus();
        }
        _adjustDialog() {
          const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
          const scrollbarWidth = this._scrollBar.getWidth();
          const isBodyOverflowing = scrollbarWidth > 0;
          if (isBodyOverflowing && !isModalOverflowing) {
            const property = isRTL() ? "paddingLeft" : "paddingRight";
            this._element.style[property] = `${scrollbarWidth}px`;
          }
          if (!isBodyOverflowing && isModalOverflowing) {
            const property = isRTL() ? "paddingRight" : "paddingLeft";
            this._element.style[property] = `${scrollbarWidth}px`;
          }
        }
        _resetAdjustments() {
          this._element.style.paddingLeft = "";
          this._element.style.paddingRight = "";
        }
        static jQueryInterface(config, relatedTarget) {
          return this.each(function() {
            const data = Modal2.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
              return;
            }
            if (typeof data[config] === "undefined") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config](relatedTarget);
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function(event) {
        const target = getElementFromSelector(this);
        if (["A", "AREA"].includes(this.tagName)) {
          event.preventDefault();
        }
        EventHandler.one(target, EVENT_SHOW$4, (showEvent) => {
          if (showEvent.defaultPrevented) {
            return;
          }
          EventHandler.one(target, EVENT_HIDDEN$4, () => {
            if (isVisible(this)) {
              this.focus();
            }
          });
        });
        const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
        if (alreadyOpen) {
          Modal2.getInstance(alreadyOpen).hide();
        }
        const data = Modal2.getOrCreateInstance(target);
        data.toggle(this);
      });
      enableDismissTrigger(Modal2);
      defineJQueryPlugin(Modal2);
      const NAME$6 = "offcanvas";
      const DATA_KEY$3 = "bs.offcanvas";
      const EVENT_KEY$3 = `.${DATA_KEY$3}`;
      const DATA_API_KEY$1 = ".data-api";
      const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
      const ESCAPE_KEY = "Escape";
      const CLASS_NAME_SHOW$3 = "show";
      const CLASS_NAME_SHOWING$1 = "showing";
      const CLASS_NAME_HIDING = "hiding";
      const CLASS_NAME_BACKDROP = "offcanvas-backdrop";
      const OPEN_SELECTOR = ".offcanvas.show";
      const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
      const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
      const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
      const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
      const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
      const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
      const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
      const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
      const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
      const Default$5 = {
        backdrop: true,
        keyboard: true,
        scroll: false
      };
      const DefaultType$5 = {
        backdrop: "(boolean|string)",
        keyboard: "boolean",
        scroll: "boolean"
      };
      class Offcanvas extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._isShown = false;
          this._backdrop = this._initializeBackDrop();
          this._focustrap = this._initializeFocusTrap();
          this._addEventListeners();
        }
        static get Default() {
          return Default$5;
        }
        static get DefaultType() {
          return DefaultType$5;
        }
        static get NAME() {
          return NAME$6;
        }
        toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }
        show(relatedTarget) {
          if (this._isShown) {
            return;
          }
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
            relatedTarget
          });
          if (showEvent.defaultPrevented) {
            return;
          }
          this._isShown = true;
          this._backdrop.show();
          if (!this._config.scroll) {
            new ScrollBarHelper().hide();
          }
          this._element.setAttribute("aria-modal", true);
          this._element.setAttribute("role", "dialog");
          this._element.classList.add(CLASS_NAME_SHOWING$1);
          const completeCallBack = () => {
            if (!this._config.scroll || this._config.backdrop) {
              this._focustrap.activate();
            }
            this._element.classList.add(CLASS_NAME_SHOW$3);
            this._element.classList.remove(CLASS_NAME_SHOWING$1);
            EventHandler.trigger(this._element, EVENT_SHOWN$3, {
              relatedTarget
            });
          };
          this._queueCallback(completeCallBack, this._element, true);
        }
        hide() {
          if (!this._isShown) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
          if (hideEvent.defaultPrevented) {
            return;
          }
          this._focustrap.deactivate();
          this._element.blur();
          this._isShown = false;
          this._element.classList.add(CLASS_NAME_HIDING);
          this._backdrop.hide();
          const completeCallback = () => {
            this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
            this._element.removeAttribute("aria-modal");
            this._element.removeAttribute("role");
            if (!this._config.scroll) {
              new ScrollBarHelper().reset();
            }
            EventHandler.trigger(this._element, EVENT_HIDDEN$3);
          };
          this._queueCallback(completeCallback, this._element, true);
        }
        dispose() {
          this._backdrop.dispose();
          this._focustrap.deactivate();
          super.dispose();
        }
        _initializeBackDrop() {
          const clickCallback = () => {
            if (this._config.backdrop === "static") {
              EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
              return;
            }
            this.hide();
          };
          const isVisible2 = Boolean(this._config.backdrop);
          return new Backdrop({
            className: CLASS_NAME_BACKDROP,
            isVisible: isVisible2,
            isAnimated: true,
            rootElement: this._element.parentNode,
            clickCallback: isVisible2 ? clickCallback : null
          });
        }
        _initializeFocusTrap() {
          return new FocusTrap({
            trapElement: this._element
          });
        }
        _addEventListeners() {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
            if (event.key !== ESCAPE_KEY) {
              return;
            }
            if (!this._config.keyboard) {
              EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
              return;
            }
            this.hide();
          });
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Offcanvas.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
              return;
            }
            if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config](this);
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function(event) {
        const target = getElementFromSelector(this);
        if (["A", "AREA"].includes(this.tagName)) {
          event.preventDefault();
        }
        if (isDisabled(this)) {
          return;
        }
        EventHandler.one(target, EVENT_HIDDEN$3, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
        const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
        if (alreadyOpen && alreadyOpen !== target) {
          Offcanvas.getInstance(alreadyOpen).hide();
        }
        const data = Offcanvas.getOrCreateInstance(target);
        data.toggle(this);
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
        for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
          Offcanvas.getOrCreateInstance(selector).show();
        }
      });
      EventHandler.on(window, EVENT_RESIZE, () => {
        for (const element of SelectorEngine.find("[aria-modal][class*=show][class*=offcanvas-]")) {
          if (getComputedStyle(element).position !== "fixed") {
            Offcanvas.getOrCreateInstance(element).hide();
          }
        }
      });
      enableDismissTrigger(Offcanvas);
      defineJQueryPlugin(Offcanvas);
      const uriAttributes = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]);
      const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
      const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
      const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
      const allowedAttribute = (attribute, allowedAttributeList) => {
        const attributeName = attribute.nodeName.toLowerCase();
        if (allowedAttributeList.includes(attributeName)) {
          if (uriAttributes.has(attributeName)) {
            return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
          }
          return true;
        }
        return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName));
      };
      const DefaultAllowlist = {
        "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
        a: ["target", "href", "title", "rel"],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ["src", "srcset", "alt", "title", "width", "height"],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
      };
      function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
        if (!unsafeHtml.length) {
          return unsafeHtml;
        }
        if (sanitizeFunction && typeof sanitizeFunction === "function") {
          return sanitizeFunction(unsafeHtml);
        }
        const domParser = new window.DOMParser();
        const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
        const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
        for (const element of elements) {
          const elementName = element.nodeName.toLowerCase();
          if (!Object.keys(allowList).includes(elementName)) {
            element.remove();
            continue;
          }
          const attributeList = [].concat(...element.attributes);
          const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
          for (const attribute of attributeList) {
            if (!allowedAttribute(attribute, allowedAttributes)) {
              element.removeAttribute(attribute.nodeName);
            }
          }
        }
        return createdDocument.body.innerHTML;
      }
      const NAME$5 = "TemplateFactory";
      const Default$4 = {
        allowList: DefaultAllowlist,
        content: {},
        extraClass: "",
        html: false,
        sanitize: true,
        sanitizeFn: null,
        template: "<div></div>"
      };
      const DefaultType$4 = {
        allowList: "object",
        content: "object",
        extraClass: "(string|function)",
        html: "boolean",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        template: "string"
      };
      const DefaultContentType = {
        entry: "(string|element|function|null)",
        selector: "(string|element)"
      };
      class TemplateFactory extends Config {
        constructor(config) {
          super();
          this._config = this._getConfig(config);
        }
        static get Default() {
          return Default$4;
        }
        static get DefaultType() {
          return DefaultType$4;
        }
        static get NAME() {
          return NAME$5;
        }
        getContent() {
          return Object.values(this._config.content).map((config) => this._resolvePossibleFunction(config)).filter(Boolean);
        }
        hasContent() {
          return this.getContent().length > 0;
        }
        changeContent(content) {
          this._checkContent(content);
          this._config.content = {
            ...this._config.content,
            ...content
          };
          return this;
        }
        toHtml() {
          const templateWrapper = document.createElement("div");
          templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
          for (const [selector, text] of Object.entries(this._config.content)) {
            this._setContent(templateWrapper, text, selector);
          }
          const template = templateWrapper.children[0];
          const extraClass = this._resolvePossibleFunction(this._config.extraClass);
          if (extraClass) {
            template.classList.add(...extraClass.split(" "));
          }
          return template;
        }
        _typeCheckConfig(config) {
          super._typeCheckConfig(config);
          this._checkContent(config.content);
        }
        _checkContent(arg) {
          for (const [selector, content] of Object.entries(arg)) {
            super._typeCheckConfig({
              selector,
              entry: content
            }, DefaultContentType);
          }
        }
        _setContent(template, content, selector) {
          const templateElement = SelectorEngine.findOne(selector, template);
          if (!templateElement) {
            return;
          }
          content = this._resolvePossibleFunction(content);
          if (!content) {
            templateElement.remove();
            return;
          }
          if (isElement(content)) {
            this._putElementInTemplate(getElement(content), templateElement);
            return;
          }
          if (this._config.html) {
            templateElement.innerHTML = this._maybeSanitize(content);
            return;
          }
          templateElement.textContent = content;
        }
        _maybeSanitize(arg) {
          return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
        }
        _resolvePossibleFunction(arg) {
          return typeof arg === "function" ? arg(this) : arg;
        }
        _putElementInTemplate(element, templateElement) {
          if (this._config.html) {
            templateElement.innerHTML = "";
            templateElement.append(element);
            return;
          }
          templateElement.textContent = element.textContent;
        }
      }
      const NAME$4 = "tooltip";
      const DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]);
      const CLASS_NAME_FADE$2 = "fade";
      const CLASS_NAME_MODAL = "modal";
      const CLASS_NAME_SHOW$2 = "show";
      const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
      const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
      const EVENT_MODAL_HIDE = "hide.bs.modal";
      const TRIGGER_HOVER = "hover";
      const TRIGGER_FOCUS = "focus";
      const TRIGGER_CLICK = "click";
      const TRIGGER_MANUAL = "manual";
      const EVENT_HIDE$2 = "hide";
      const EVENT_HIDDEN$2 = "hidden";
      const EVENT_SHOW$2 = "show";
      const EVENT_SHOWN$2 = "shown";
      const EVENT_INSERTED = "inserted";
      const EVENT_CLICK$1 = "click";
      const EVENT_FOCUSIN$1 = "focusin";
      const EVENT_FOCUSOUT$1 = "focusout";
      const EVENT_MOUSEENTER = "mouseenter";
      const EVENT_MOUSELEAVE = "mouseleave";
      const AttachmentMap = {
        AUTO: "auto",
        TOP: "top",
        RIGHT: isRTL() ? "left" : "right",
        BOTTOM: "bottom",
        LEFT: isRTL() ? "right" : "left"
      };
      const Default$3 = {
        allowList: DefaultAllowlist,
        animation: true,
        boundary: "clippingParents",
        container: false,
        customClass: "",
        delay: 0,
        fallbackPlacements: ["top", "right", "bottom", "left"],
        html: false,
        offset: [0, 0],
        placement: "top",
        popperConfig: null,
        sanitize: true,
        sanitizeFn: null,
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        title: "",
        trigger: "hover focus"
      };
      const DefaultType$3 = {
        allowList: "object",
        animation: "boolean",
        boundary: "(string|element)",
        container: "(string|element|boolean)",
        customClass: "(string|function)",
        delay: "(number|object)",
        fallbackPlacements: "array",
        html: "boolean",
        offset: "(array|string|function)",
        placement: "(string|function)",
        popperConfig: "(null|object|function)",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        selector: "(string|boolean)",
        template: "string",
        title: "(string|element|function)",
        trigger: "string"
      };
      class Tooltip2 extends BaseComponent {
        constructor(element, config) {
          if (typeof Popper__namespace === "undefined") {
            throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
          }
          super(element, config);
          this._isEnabled = true;
          this._timeout = 0;
          this._isHovered = null;
          this._activeTrigger = {};
          this._popper = null;
          this._templateFactory = null;
          this._newContent = null;
          this.tip = null;
          this._setListeners();
        }
        static get Default() {
          return Default$3;
        }
        static get DefaultType() {
          return DefaultType$3;
        }
        static get NAME() {
          return NAME$4;
        }
        enable() {
          this._isEnabled = true;
        }
        disable() {
          this._isEnabled = false;
        }
        toggleEnabled() {
          this._isEnabled = !this._isEnabled;
        }
        toggle(event) {
          if (!this._isEnabled) {
            return;
          }
          if (event) {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger.click = !context._activeTrigger.click;
            if (context._isWithActiveTrigger()) {
              context._enter();
            } else {
              context._leave();
            }
            return;
          }
          if (this._isShown()) {
            this._leave();
            return;
          }
          this._enter();
        }
        dispose() {
          clearTimeout(this._timeout);
          EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
          if (this.tip) {
            this.tip.remove();
          }
          if (this._config.originalTitle) {
            this._element.setAttribute("title", this._config.originalTitle);
          }
          this._disposePopper();
          super.dispose();
        }
        show() {
          if (this._element.style.display === "none") {
            throw new Error("Please use show on visible elements");
          }
          if (!(this._isWithContent() && this._isEnabled)) {
            return;
          }
          const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
          const shadowRoot = findShadowRoot(this._element);
          const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
          if (showEvent.defaultPrevented || !isInTheDom) {
            return;
          }
          if (this.tip) {
            this.tip.remove();
            this.tip = null;
          }
          const tip = this._getTipElement();
          this._element.setAttribute("aria-describedby", tip.getAttribute("id"));
          const {
            container
          } = this._config;
          if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
            container.append(tip);
            EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
          }
          if (this._popper) {
            this._popper.update();
          } else {
            this._popper = this._createPopper(tip);
          }
          tip.classList.add(CLASS_NAME_SHOW$2);
          if ("ontouchstart" in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.on(element, "mouseover", noop);
            }
          }
          const complete = () => {
            EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
            if (this._isHovered === false) {
              this._leave();
            }
            this._isHovered = false;
          };
          this._queueCallback(complete, this.tip, this._isAnimated());
        }
        hide() {
          if (!this._isShown()) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
          if (hideEvent.defaultPrevented) {
            return;
          }
          const tip = this._getTipElement();
          tip.classList.remove(CLASS_NAME_SHOW$2);
          if ("ontouchstart" in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
              EventHandler.off(element, "mouseover", noop);
            }
          }
          this._activeTrigger[TRIGGER_CLICK] = false;
          this._activeTrigger[TRIGGER_FOCUS] = false;
          this._activeTrigger[TRIGGER_HOVER] = false;
          this._isHovered = null;
          const complete = () => {
            if (this._isWithActiveTrigger()) {
              return;
            }
            if (!this._isHovered) {
              tip.remove();
            }
            this._element.removeAttribute("aria-describedby");
            EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
            this._disposePopper();
          };
          this._queueCallback(complete, this.tip, this._isAnimated());
        }
        update() {
          if (this._popper) {
            this._popper.update();
          }
        }
        _isWithContent() {
          return Boolean(this._getTitle());
        }
        _getTipElement() {
          if (!this.tip) {
            this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
          }
          return this.tip;
        }
        _createTipElement(content) {
          const tip = this._getTemplateFactory(content).toHtml();
          if (!tip) {
            return null;
          }
          tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
          tip.classList.add(`bs-${this.constructor.NAME}-auto`);
          const tipId = getUID(this.constructor.NAME).toString();
          tip.setAttribute("id", tipId);
          if (this._isAnimated()) {
            tip.classList.add(CLASS_NAME_FADE$2);
          }
          return tip;
        }
        setContent(content) {
          this._newContent = content;
          if (this._isShown()) {
            this._disposePopper();
            this.show();
          }
        }
        _getTemplateFactory(content) {
          if (this._templateFactory) {
            this._templateFactory.changeContent(content);
          } else {
            this._templateFactory = new TemplateFactory({
              ...this._config,
              content,
              extraClass: this._resolvePossibleFunction(this._config.customClass)
            });
          }
          return this._templateFactory;
        }
        _getContentForTemplate() {
          return {
            [SELECTOR_TOOLTIP_INNER]: this._getTitle()
          };
        }
        _getTitle() {
          return this._resolvePossibleFunction(this._config.title) || this._config.originalTitle;
        }
        _initializeOnDelegatedTarget(event) {
          return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
        }
        _isAnimated() {
          return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
        }
        _isShown() {
          return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
        }
        _createPopper(tip) {
          const placement = typeof this._config.placement === "function" ? this._config.placement.call(this, tip, this._element) : this._config.placement;
          const attachment = AttachmentMap[placement.toUpperCase()];
          return Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
        }
        _getOffset() {
          const {
            offset
          } = this._config;
          if (typeof offset === "string") {
            return offset.split(",").map((value) => Number.parseInt(value, 10));
          }
          if (typeof offset === "function") {
            return (popperData) => offset(popperData, this._element);
          }
          return offset;
        }
        _resolvePossibleFunction(arg) {
          return typeof arg === "function" ? arg.call(this._element) : arg;
        }
        _getPopperConfig(attachment) {
          const defaultBsPopperConfig = {
            placement: attachment,
            modifiers: [{
              name: "flip",
              options: {
                fallbackPlacements: this._config.fallbackPlacements
              }
            }, {
              name: "offset",
              options: {
                offset: this._getOffset()
              }
            }, {
              name: "preventOverflow",
              options: {
                boundary: this._config.boundary
              }
            }, {
              name: "arrow",
              options: {
                element: `.${this.constructor.NAME}-arrow`
              }
            }, {
              name: "preSetPlacement",
              enabled: true,
              phase: "beforeMain",
              fn: (data) => {
                this._getTipElement().setAttribute("data-popper-placement", data.state.placement);
              }
            }]
          };
          return {
            ...defaultBsPopperConfig,
            ...typeof this._config.popperConfig === "function" ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
          };
        }
        _setListeners() {
          const triggers = this._config.trigger.split(" ");
          for (const trigger of triggers) {
            if (trigger === "click") {
              EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, (event) => this.toggle(event));
            } else if (trigger !== TRIGGER_MANUAL) {
              const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
              const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
              EventHandler.on(this._element, eventIn, this._config.selector, (event) => {
                const context = this._initializeOnDelegatedTarget(event);
                context._activeTrigger[event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
                context._enter();
              });
              EventHandler.on(this._element, eventOut, this._config.selector, (event) => {
                const context = this._initializeOnDelegatedTarget(event);
                context._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
                context._leave();
              });
            }
          }
          this._hideModalHandler = () => {
            if (this._element) {
              this.hide();
            }
          };
          EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
          if (this._config.selector) {
            this._config = {
              ...this._config,
              trigger: "manual",
              selector: ""
            };
          } else {
            this._fixTitle();
          }
        }
        _fixTitle() {
          const title = this._config.originalTitle;
          if (!title) {
            return;
          }
          if (!this._element.getAttribute("aria-label") && !this._element.textContent.trim()) {
            this._element.setAttribute("aria-label", title);
          }
          this._element.removeAttribute("title");
        }
        _enter() {
          if (this._isShown() || this._isHovered) {
            this._isHovered = true;
            return;
          }
          this._isHovered = true;
          this._setTimeout(() => {
            if (this._isHovered) {
              this.show();
            }
          }, this._config.delay.show);
        }
        _leave() {
          if (this._isWithActiveTrigger()) {
            return;
          }
          this._isHovered = false;
          this._setTimeout(() => {
            if (!this._isHovered) {
              this.hide();
            }
          }, this._config.delay.hide);
        }
        _setTimeout(handler, timeout) {
          clearTimeout(this._timeout);
          this._timeout = setTimeout(handler, timeout);
        }
        _isWithActiveTrigger() {
          return Object.values(this._activeTrigger).includes(true);
        }
        _getConfig(config) {
          const dataAttributes = Manipulator.getDataAttributes(this._element);
          for (const dataAttribute of Object.keys(dataAttributes)) {
            if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
              delete dataAttributes[dataAttribute];
            }
          }
          config = {
            ...dataAttributes,
            ...typeof config === "object" && config ? config : {}
          };
          config = this._mergeConfigObj(config);
          config = this._configAfterMerge(config);
          this._typeCheckConfig(config);
          return config;
        }
        _configAfterMerge(config) {
          config.container = config.container === false ? document.body : getElement(config.container);
          if (typeof config.delay === "number") {
            config.delay = {
              show: config.delay,
              hide: config.delay
            };
          }
          config.originalTitle = this._element.getAttribute("title") || "";
          if (typeof config.title === "number") {
            config.title = config.title.toString();
          }
          if (typeof config.content === "number") {
            config.content = config.content.toString();
          }
          return config;
        }
        _getDelegateConfig() {
          const config = {};
          for (const key in this._config) {
            if (this.constructor.Default[key] !== this._config[key]) {
              config[key] = this._config[key];
            }
          }
          return config;
        }
        _disposePopper() {
          if (this._popper) {
            this._popper.destroy();
            this._popper = null;
          }
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Tooltip2.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
              return;
            }
            if (typeof data[config] === "undefined") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          });
        }
      }
      defineJQueryPlugin(Tooltip2);
      const NAME$3 = "popover";
      const SELECTOR_TITLE = ".popover-header";
      const SELECTOR_CONTENT = ".popover-body";
      const Default$2 = {
        ...Tooltip2.Default,
        content: "",
        offset: [0, 8],
        placement: "right",
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        trigger: "click"
      };
      const DefaultType$2 = {
        ...Tooltip2.DefaultType,
        content: "(null|string|element|function)"
      };
      class Popover extends Tooltip2 {
        static get Default() {
          return Default$2;
        }
        static get DefaultType() {
          return DefaultType$2;
        }
        static get NAME() {
          return NAME$3;
        }
        _isWithContent() {
          return this._getTitle() || this._getContent();
        }
        _getContentForTemplate() {
          return {
            [SELECTOR_TITLE]: this._getTitle(),
            [SELECTOR_CONTENT]: this._getContent()
          };
        }
        _getContent() {
          return this._resolvePossibleFunction(this._config.content);
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Popover.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
              return;
            }
            if (typeof data[config] === "undefined") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          });
        }
      }
      defineJQueryPlugin(Popover);
      const NAME$2 = "scrollspy";
      const DATA_KEY$2 = "bs.scrollspy";
      const EVENT_KEY$2 = `.${DATA_KEY$2}`;
      const DATA_API_KEY = ".data-api";
      const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
      const EVENT_CLICK = `click${EVENT_KEY$2}`;
      const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
      const CLASS_NAME_DROPDOWN_ITEM = "dropdown-item";
      const CLASS_NAME_ACTIVE$1 = "active";
      const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
      const SELECTOR_TARGET_LINKS = "[href]";
      const SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
      const SELECTOR_NAV_LINKS = ".nav-link";
      const SELECTOR_NAV_ITEMS = ".nav-item";
      const SELECTOR_LIST_ITEMS = ".list-group-item";
      const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
      const SELECTOR_DROPDOWN = ".dropdown";
      const SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle";
      const Default$1 = {
        offset: null,
        rootMargin: "0px 0px -25%",
        smoothScroll: false,
        target: null,
        threshold: [0.1, 0.5, 1]
      };
      const DefaultType$1 = {
        offset: "(number|null)",
        rootMargin: "string",
        smoothScroll: "boolean",
        target: "element",
        threshold: "array"
      };
      class ScrollSpy extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._targetLinks = /* @__PURE__ */ new Map();
          this._observableSections = /* @__PURE__ */ new Map();
          this._rootElement = getComputedStyle(this._element).overflowY === "visible" ? null : this._element;
          this._activeTarget = null;
          this._observer = null;
          this._previousScrollData = {
            visibleEntryTop: 0,
            parentScrollTop: 0
          };
          this.refresh();
        }
        static get Default() {
          return Default$1;
        }
        static get DefaultType() {
          return DefaultType$1;
        }
        static get NAME() {
          return NAME$2;
        }
        refresh() {
          this._initializeTargetsAndObservables();
          this._maybeEnableSmoothScroll();
          if (this._observer) {
            this._observer.disconnect();
          } else {
            this._observer = this._getNewObserver();
          }
          for (const section of this._observableSections.values()) {
            this._observer.observe(section);
          }
        }
        dispose() {
          this._observer.disconnect();
          super.dispose();
        }
        _configAfterMerge(config) {
          config.target = getElement(config.target) || document.body;
          config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
          if (typeof config.threshold === "string") {
            config.threshold = config.threshold.split(",").map((value) => Number.parseFloat(value));
          }
          return config;
        }
        _maybeEnableSmoothScroll() {
          if (!this._config.smoothScroll) {
            return;
          }
          EventHandler.off(this._config.target, EVENT_CLICK);
          EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event) => {
            const observableSection = this._observableSections.get(event.target.hash);
            if (observableSection) {
              event.preventDefault();
              const root = this._rootElement || window;
              const height = observableSection.offsetTop - this._element.offsetTop;
              if (root.scrollTo) {
                root.scrollTo({
                  top: height,
                  behavior: "smooth"
                });
                return;
              }
              root.scrollTop = height;
            }
          });
        }
        _getNewObserver() {
          const options = {
            root: this._rootElement,
            threshold: this._config.threshold,
            rootMargin: this._config.rootMargin
          };
          return new IntersectionObserver((entries) => this._observerCallback(entries), options);
        }
        _observerCallback(entries) {
          const targetElement = (entry) => this._targetLinks.get(`#${entry.target.id}`);
          const activate = (entry) => {
            this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
            this._process(targetElement(entry));
          };
          const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
          const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
          this._previousScrollData.parentScrollTop = parentScrollTop;
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              this._activeTarget = null;
              this._clearActiveClass(targetElement(entry));
              continue;
            }
            const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
            if (userScrollsDown && entryIsLowerThanPrevious) {
              activate(entry);
              if (!parentScrollTop) {
                return;
              }
              continue;
            }
            if (!userScrollsDown && !entryIsLowerThanPrevious) {
              activate(entry);
            }
          }
        }
        _initializeTargetsAndObservables() {
          this._targetLinks = /* @__PURE__ */ new Map();
          this._observableSections = /* @__PURE__ */ new Map();
          const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
          for (const anchor of targetLinks) {
            if (!anchor.hash || isDisabled(anchor)) {
              continue;
            }
            const observableSection = SelectorEngine.findOne(anchor.hash, this._element);
            if (isVisible(observableSection)) {
              this._targetLinks.set(anchor.hash, anchor);
              this._observableSections.set(anchor.hash, observableSection);
            }
          }
        }
        _process(target) {
          if (this._activeTarget === target) {
            return;
          }
          this._clearActiveClass(this._config.target);
          this._activeTarget = target;
          target.classList.add(CLASS_NAME_ACTIVE$1);
          this._activateParents(target);
          EventHandler.trigger(this._element, EVENT_ACTIVATE, {
            relatedTarget: target
          });
        }
        _activateParents(target) {
          if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
            SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
            return;
          }
          for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
            for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
              item.classList.add(CLASS_NAME_ACTIVE$1);
            }
          }
        }
        _clearActiveClass(parent) {
          parent.classList.remove(CLASS_NAME_ACTIVE$1);
          const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
          for (const node of activeNodes) {
            node.classList.remove(CLASS_NAME_ACTIVE$1);
          }
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = ScrollSpy.getOrCreateInstance(this, config);
            if (typeof config !== "string") {
              return;
            }
            if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          });
        }
      }
      EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
        for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
          ScrollSpy.getOrCreateInstance(spy);
        }
      });
      defineJQueryPlugin(ScrollSpy);
      const NAME$1 = "tab";
      const DATA_KEY$1 = "bs.tab";
      const EVENT_KEY$1 = `.${DATA_KEY$1}`;
      const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
      const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
      const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
      const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
      const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
      const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
      const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
      const ARROW_LEFT_KEY = "ArrowLeft";
      const ARROW_RIGHT_KEY = "ArrowRight";
      const ARROW_UP_KEY = "ArrowUp";
      const ARROW_DOWN_KEY = "ArrowDown";
      const CLASS_NAME_ACTIVE = "active";
      const CLASS_NAME_FADE$1 = "fade";
      const CLASS_NAME_SHOW$1 = "show";
      const CLASS_DROPDOWN = "dropdown";
      const SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle";
      const SELECTOR_DROPDOWN_MENU = ".dropdown-menu";
      const SELECTOR_DROPDOWN_ITEM = ".dropdown-item";
      const NOT_SELECTOR_DROPDOWN_TOGGLE = ":not(.dropdown-toggle)";
      const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
      const SELECTOR_OUTER = ".nav-item, .list-group-item";
      const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
      const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
      const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
      const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
      class Tab extends BaseComponent {
        constructor(element) {
          super(element);
          this._parent = this._element.closest(SELECTOR_TAB_PANEL);
          if (!this._parent) {
            return;
          }
          this._setInitialAttributes(this._parent, this._getChildren());
          EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
        }
        static get NAME() {
          return NAME$1;
        }
        show() {
          const innerElem = this._element;
          if (this._elemIsActive(innerElem)) {
            return;
          }
          const active = this._getActiveElem();
          const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
            relatedTarget: innerElem
          }) : null;
          const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
            relatedTarget: active
          });
          if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
            return;
          }
          this._deactivate(active, innerElem);
          this._activate(innerElem, active);
        }
        _activate(element, relatedElem) {
          if (!element) {
            return;
          }
          element.classList.add(CLASS_NAME_ACTIVE);
          this._activate(getElementFromSelector(element));
          const complete = () => {
            if (element.getAttribute("role") !== "tab") {
              element.classList.add(CLASS_NAME_SHOW$1);
              return;
            }
            element.focus();
            element.removeAttribute("tabindex");
            element.setAttribute("aria-selected", true);
            this._toggleDropDown(element, true);
            EventHandler.trigger(element, EVENT_SHOWN$1, {
              relatedTarget: relatedElem
            });
          };
          this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
        }
        _deactivate(element, relatedElem) {
          if (!element) {
            return;
          }
          element.classList.remove(CLASS_NAME_ACTIVE);
          element.blur();
          this._deactivate(getElementFromSelector(element));
          const complete = () => {
            if (element.getAttribute("role") !== "tab") {
              element.classList.remove(CLASS_NAME_SHOW$1);
              return;
            }
            element.setAttribute("aria-selected", false);
            element.setAttribute("tabindex", "-1");
            this._toggleDropDown(element, false);
            EventHandler.trigger(element, EVENT_HIDDEN$1, {
              relatedTarget: relatedElem
            });
          };
          this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
        }
        _keydown(event) {
          if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)) {
            return;
          }
          event.stopPropagation();
          event.preventDefault();
          const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
          const nextActiveElement = getNextActiveElement(this._getChildren().filter((element) => !isDisabled(element)), event.target, isNext, true);
          if (nextActiveElement) {
            Tab.getOrCreateInstance(nextActiveElement).show();
          }
        }
        _getChildren() {
          return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
        }
        _getActiveElem() {
          return this._getChildren().find((child) => this._elemIsActive(child)) || null;
        }
        _setInitialAttributes(parent, children) {
          this._setAttributeIfNotExists(parent, "role", "tablist");
          for (const child of children) {
            this._setInitialAttributesOnChild(child);
          }
        }
        _setInitialAttributesOnChild(child) {
          child = this._getInnerElement(child);
          const isActive = this._elemIsActive(child);
          const outerElem = this._getOuterElement(child);
          child.setAttribute("aria-selected", isActive);
          if (outerElem !== child) {
            this._setAttributeIfNotExists(outerElem, "role", "presentation");
          }
          if (!isActive) {
            child.setAttribute("tabindex", "-1");
          }
          this._setAttributeIfNotExists(child, "role", "tab");
          this._setInitialAttributesOnTargetPanel(child);
        }
        _setInitialAttributesOnTargetPanel(child) {
          const target = getElementFromSelector(child);
          if (!target) {
            return;
          }
          this._setAttributeIfNotExists(target, "role", "tabpanel");
          if (child.id) {
            this._setAttributeIfNotExists(target, "aria-labelledby", `#${child.id}`);
          }
        }
        _toggleDropDown(element, open) {
          const outerElem = this._getOuterElement(element);
          if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
            return;
          }
          const toggle = (selector, className) => {
            const element2 = SelectorEngine.findOne(selector, outerElem);
            if (element2) {
              element2.classList.toggle(className, open);
            }
          };
          toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
          toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
          toggle(SELECTOR_DROPDOWN_ITEM, CLASS_NAME_ACTIVE);
          outerElem.setAttribute("aria-expanded", open);
        }
        _setAttributeIfNotExists(element, attribute, value) {
          if (!element.hasAttribute(attribute)) {
            element.setAttribute(attribute, value);
          }
        }
        _elemIsActive(elem) {
          return elem.classList.contains(CLASS_NAME_ACTIVE);
        }
        _getInnerElement(elem) {
          return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
        }
        _getOuterElement(elem) {
          return elem.closest(SELECTOR_OUTER) || elem;
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Tab.getOrCreateInstance(this);
            if (typeof config !== "string") {
              return;
            }
            if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
              throw new TypeError(`No method named "${config}"`);
            }
            data[config]();
          });
        }
      }
      EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
        if (["A", "AREA"].includes(this.tagName)) {
          event.preventDefault();
        }
        if (isDisabled(this)) {
          return;
        }
        Tab.getOrCreateInstance(this).show();
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
        for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
          Tab.getOrCreateInstance(element);
        }
      });
      defineJQueryPlugin(Tab);
      const NAME = "toast";
      const DATA_KEY = "bs.toast";
      const EVENT_KEY = `.${DATA_KEY}`;
      const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
      const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
      const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
      const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
      const EVENT_HIDE = `hide${EVENT_KEY}`;
      const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
      const EVENT_SHOW = `show${EVENT_KEY}`;
      const EVENT_SHOWN = `shown${EVENT_KEY}`;
      const CLASS_NAME_FADE = "fade";
      const CLASS_NAME_HIDE = "hide";
      const CLASS_NAME_SHOW = "show";
      const CLASS_NAME_SHOWING = "showing";
      const DefaultType = {
        animation: "boolean",
        autohide: "boolean",
        delay: "number"
      };
      const Default = {
        animation: true,
        autohide: true,
        delay: 5e3
      };
      class Toast extends BaseComponent {
        constructor(element, config) {
          super(element, config);
          this._timeout = null;
          this._hasMouseInteraction = false;
          this._hasKeyboardInteraction = false;
          this._setListeners();
        }
        static get Default() {
          return Default;
        }
        static get DefaultType() {
          return DefaultType;
        }
        static get NAME() {
          return NAME;
        }
        show() {
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
          if (showEvent.defaultPrevented) {
            return;
          }
          this._clearTimeout();
          if (this._config.animation) {
            this._element.classList.add(CLASS_NAME_FADE);
          }
          const complete = () => {
            this._element.classList.remove(CLASS_NAME_SHOWING);
            EventHandler.trigger(this._element, EVENT_SHOWN);
            this._maybeScheduleHide();
          };
          this._element.classList.remove(CLASS_NAME_HIDE);
          reflow(this._element);
          this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
          this._queueCallback(complete, this._element, this._config.animation);
        }
        hide() {
          if (!this.isShown()) {
            return;
          }
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
          if (hideEvent.defaultPrevented) {
            return;
          }
          const complete = () => {
            this._element.classList.add(CLASS_NAME_HIDE);
            this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
            EventHandler.trigger(this._element, EVENT_HIDDEN);
          };
          this._element.classList.add(CLASS_NAME_SHOWING);
          this._queueCallback(complete, this._element, this._config.animation);
        }
        dispose() {
          this._clearTimeout();
          if (this.isShown()) {
            this._element.classList.remove(CLASS_NAME_SHOW);
          }
          super.dispose();
        }
        isShown() {
          return this._element.classList.contains(CLASS_NAME_SHOW);
        }
        _maybeScheduleHide() {
          if (!this._config.autohide) {
            return;
          }
          if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
            return;
          }
          this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay);
        }
        _onInteraction(event, isInteracting) {
          switch (event.type) {
            case "mouseover":
            case "mouseout":
              this._hasMouseInteraction = isInteracting;
              break;
            case "focusin":
            case "focusout":
              this._hasKeyboardInteraction = isInteracting;
              break;
          }
          if (isInteracting) {
            this._clearTimeout();
            return;
          }
          const nextElement = event.relatedTarget;
          if (this._element === nextElement || this._element.contains(nextElement)) {
            return;
          }
          this._maybeScheduleHide();
        }
        _setListeners() {
          EventHandler.on(this._element, EVENT_MOUSEOVER, (event) => this._onInteraction(event, true));
          EventHandler.on(this._element, EVENT_MOUSEOUT, (event) => this._onInteraction(event, false));
          EventHandler.on(this._element, EVENT_FOCUSIN, (event) => this._onInteraction(event, true));
          EventHandler.on(this._element, EVENT_FOCUSOUT, (event) => this._onInteraction(event, false));
        }
        _clearTimeout() {
          clearTimeout(this._timeout);
          this._timeout = null;
        }
        static jQueryInterface(config) {
          return this.each(function() {
            const data = Toast.getOrCreateInstance(this, config);
            if (typeof config === "string") {
              if (typeof data[config] === "undefined") {
                throw new TypeError(`No method named "${config}"`);
              }
              data[config](this);
            }
          });
        }
      }
      enableDismissTrigger(Toast);
      defineJQueryPlugin(Toast);
      const index_umd = {
        Alert,
        Button,
        Carousel,
        Collapse,
        Dropdown,
        Modal: Modal2,
        Offcanvas,
        Popover,
        ScrollSpy,
        Tab,
        Toast,
        Tooltip: Tooltip2
      };
      return index_umd;
    });
  }
});

// node_modules/json-format-highlight/dist/json-format-highlight.js
var require_json_format_highlight = __commonJS({
  "node_modules/json-format-highlight/dist/json-format-highlight.js"(exports, module2) {
    (function(global, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.jsonFormatHighlight = factory();
    })(exports, function() {
      "use strict";
      var defaultColors = {
        keyColor: "dimgray",
        numberColor: "lightskyblue",
        stringColor: "lightcoral",
        trueColor: "lightseagreen",
        falseColor: "#f66578",
        nullColor: "cornflowerblue"
      };
      var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#x60;",
        "=": "&#x3D;"
      };
      function escapeHtml(html) {
        return String(html).replace(/[&<>"'`=]/g, function(s) {
          return entityMap[s];
        });
      }
      function index(json, colorOptions) {
        if (colorOptions === void 0)
          colorOptions = {};
        var valueType = typeof json;
        if (valueType !== "string") {
          json = JSON.stringify(json, null, 2) || valueType;
        }
        var colors = Object.assign({}, defaultColors, colorOptions);
        json = json.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function(match) {
          var color = colors.numberColor;
          var style = "";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              color = colors.keyColor;
            } else {
              color = colors.stringColor;
              match = '"' + escapeHtml(match.substr(1, match.length - 2)) + '"';
              style = "word-wrap:break-word;white-space:pre-wrap;";
            }
          } else {
            color = /true/.test(match) ? colors.trueColor : /false/.test(match) ? colors.falseColor : /null/.test(match) ? colors.nullColor : color;
          }
          return '<span style="' + style + "color:" + color + '">' + match + "</span>";
        });
      }
      return index;
    });
  }
});

// cli/webServerlessSpy.ts
var import_bootstrap = __toESM(require_bootstrap());
var import_json_format_highlight = __toESM(require_json_format_highlight());

// cli/messages.ts
var list = [
  {
    timestamp: "2022-09-20T09:46:04.610Z",
    serviceKey: "Function#ToSnsAndDynamoDb#Request",
    data: {
      request: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      context: {
        functionName: "ServerlessSpyE2e-ToSnsAndDynamoDb13696817-sagu3HTK25K6",
        awsRequestId: "ba4d4569-416a-407b-9842-0ee38a83b97c"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.674Z",
    serviceKey: "Function#ToSnsAndDynamoDb#Response",
    data: {
      request: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      response: {
        id: "057f544b-7f90-496c-8006-3043dec54620",
        message: "Hello"
      },
      context: {
        functionName: "ServerlessSpyE2e-ToSnsAndDynamoDb13696817-sagu3HTK25K6",
        awsRequestId: "ba4d4569-416a-407b-9842-0ee38a83b97c"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.751Z",
    serviceKey: "Function#ReceiveSqs#Response",
    data: {
      request: {
        Records: [
          {
            messageId: "b1dd1d88-0560-43de-a406-394ca4bb7cec",
            receiptHandle: "AQEBivlgjdhylhmB95VJL1K1OGeZpzOmbZAiaNUT/EnlDN/Bmlo7o/Aby9zveOanusGVdsBwF5VAbQEPc17y1sNa/mA3gN54I13/vm9K0rmLlmMG77yp4e/VhbK9qx8xG+w87JCDC1iw8alEea+zqiBqWFalEUL0SAT8lkkS/plq4AA1B40ytuVZm4HGnTc+4SltCFmmbxFMDblSZ5fzQ6jyQAnh8Hb5kDQTwbKu7eRI14XvNC39tlb1kGGYHQa7jOqC6KAjqozwTeZjcEgUzjNoqyqzNXL4lWpucxO/YgFEqi7aRiPQZZO2UY9mgWPgNp17P5LGOu4Kh48hFs6vvfQMkqAOskN3KWzj9o/N4QC3pvKRE3r9cFgYh6UdwQwBI/P7c+QBBqt1JG89DklJBobmzcLjI+agJaP5RWb6tBwhOzCC3CbOwqfr/myLfcPF3ZZj",
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "f2a02b45-0ecb-566c-9616-70e680d73f8c",\n  "TopicArn" : "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",\n  "Message" : "{\\"id\\":\\"057f544b-7f90-496c-8006-3043dec54620\\",\\"message\\":\\"Hello\\"}",\n  "Timestamp" : "2022-09-20T09:46:04.607Z",\n  "SignatureVersion" : "1",\n  "Signature" : "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",\n  "MessageAttributes" : {\n    "test" : {"Type":"String","Value":"test"}\n  }\n}',
            attributes: {
              ApproximateReceiveCount: "1",
              AWSTraceHeader: "Root=1-63298bdc-40943faf493e196b4e07459c;Parent=24c04ec26b26310a;Sampled=0",
              SentTimestamp: "1663667164636",
              SenderId: "AIDAISMY7JYY5F7RTT6AO",
              ApproximateFirstReceiveTimestamp: "1663667164641"
            },
            messageAttributes: {},
            md5OfBody: "af6bd3f6989ac11fa4a33798c0cf87cc",
            eventSource: "aws:sqs",
            eventSourceARN: "arn:aws:sqs:eu-west-1:076585967075:ServerlessSpyE2e-MyQueueNo154EF6659-jvYNz1YlvYdQ",
            awsRegion: "eu-west-1"
          }
        ]
      },
      response: {
        Records: [
          {
            messageId: "b1dd1d88-0560-43de-a406-394ca4bb7cec",
            receiptHandle: "AQEBivlgjdhylhmB95VJL1K1OGeZpzOmbZAiaNUT/EnlDN/Bmlo7o/Aby9zveOanusGVdsBwF5VAbQEPc17y1sNa/mA3gN54I13/vm9K0rmLlmMG77yp4e/VhbK9qx8xG+w87JCDC1iw8alEea+zqiBqWFalEUL0SAT8lkkS/plq4AA1B40ytuVZm4HGnTc+4SltCFmmbxFMDblSZ5fzQ6jyQAnh8Hb5kDQTwbKu7eRI14XvNC39tlb1kGGYHQa7jOqC6KAjqozwTeZjcEgUzjNoqyqzNXL4lWpucxO/YgFEqi7aRiPQZZO2UY9mgWPgNp17P5LGOu4Kh48hFs6vvfQMkqAOskN3KWzj9o/N4QC3pvKRE3r9cFgYh6UdwQwBI/P7c+QBBqt1JG89DklJBobmzcLjI+agJaP5RWb6tBwhOzCC3CbOwqfr/myLfcPF3ZZj",
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "f2a02b45-0ecb-566c-9616-70e680d73f8c",\n  "TopicArn" : "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",\n  "Message" : "{\\"id\\":\\"057f544b-7f90-496c-8006-3043dec54620\\",\\"message\\":\\"Hello\\"}",\n  "Timestamp" : "2022-09-20T09:46:04.607Z",\n  "SignatureVersion" : "1",\n  "Signature" : "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",\n  "MessageAttributes" : {\n    "test" : {"Type":"String","Value":"test"}\n  }\n}',
            attributes: {
              ApproximateReceiveCount: "1",
              AWSTraceHeader: "Root=1-63298bdc-40943faf493e196b4e07459c;Parent=24c04ec26b26310a;Sampled=0",
              SentTimestamp: "1663667164636",
              SenderId: "AIDAISMY7JYY5F7RTT6AO",
              ApproximateFirstReceiveTimestamp: "1663667164641"
            },
            messageAttributes: {},
            md5OfBody: "af6bd3f6989ac11fa4a33798c0cf87cc",
            eventSource: "aws:sqs",
            eventSourceARN: "arn:aws:sqs:eu-west-1:076585967075:ServerlessSpyE2e-MyQueueNo154EF6659-jvYNz1YlvYdQ",
            awsRegion: "eu-west-1"
          }
        ]
      },
      context: {
        functionName: "ServerlessSpyE2e-ReceiveSqs09F03F56-XeqiZ0cUjJl4",
        awsRequestId: "23672a4d-68be-5ad1-a139-71eee6b20c4c"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.755Z",
    serviceKey: "Function#ReceiveSqs#Request",
    data: {
      request: {
        Records: [
          {
            messageId: "b1dd1d88-0560-43de-a406-394ca4bb7cec",
            receiptHandle: "AQEBivlgjdhylhmB95VJL1K1OGeZpzOmbZAiaNUT/EnlDN/Bmlo7o/Aby9zveOanusGVdsBwF5VAbQEPc17y1sNa/mA3gN54I13/vm9K0rmLlmMG77yp4e/VhbK9qx8xG+w87JCDC1iw8alEea+zqiBqWFalEUL0SAT8lkkS/plq4AA1B40ytuVZm4HGnTc+4SltCFmmbxFMDblSZ5fzQ6jyQAnh8Hb5kDQTwbKu7eRI14XvNC39tlb1kGGYHQa7jOqC6KAjqozwTeZjcEgUzjNoqyqzNXL4lWpucxO/YgFEqi7aRiPQZZO2UY9mgWPgNp17P5LGOu4Kh48hFs6vvfQMkqAOskN3KWzj9o/N4QC3pvKRE3r9cFgYh6UdwQwBI/P7c+QBBqt1JG89DklJBobmzcLjI+agJaP5RWb6tBwhOzCC3CbOwqfr/myLfcPF3ZZj",
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "f2a02b45-0ecb-566c-9616-70e680d73f8c",\n  "TopicArn" : "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",\n  "Message" : "{\\"id\\":\\"057f544b-7f90-496c-8006-3043dec54620\\",\\"message\\":\\"Hello\\"}",\n  "Timestamp" : "2022-09-20T09:46:04.607Z",\n  "SignatureVersion" : "1",\n  "Signature" : "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",\n  "MessageAttributes" : {\n    "test" : {"Type":"String","Value":"test"}\n  }\n}',
            attributes: {
              ApproximateReceiveCount: "1",
              AWSTraceHeader: "Root=1-63298bdc-40943faf493e196b4e07459c;Parent=24c04ec26b26310a;Sampled=0",
              SentTimestamp: "1663667164636",
              SenderId: "AIDAISMY7JYY5F7RTT6AO",
              ApproximateFirstReceiveTimestamp: "1663667164641"
            },
            messageAttributes: {},
            md5OfBody: "af6bd3f6989ac11fa4a33798c0cf87cc",
            eventSource: "aws:sqs",
            eventSourceARN: "arn:aws:sqs:eu-west-1:076585967075:ServerlessSpyE2e-MyQueueNo154EF6659-jvYNz1YlvYdQ",
            awsRegion: "eu-west-1"
          }
        ]
      },
      context: {
        functionName: "ServerlessSpyE2e-ReceiveSqs09F03F56-XeqiZ0cUjJl4",
        awsRequestId: "23672a4d-68be-5ad1-a139-71eee6b20c4c"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.800Z",
    serviceKey: "SnsSubscription#MyTopicNo1#MyQueueNo1",
    data: {
      spyEventType: "SnsSubscription",
      message: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      subject: null,
      timestamp: "2022-09-20T09:46:04.607Z",
      topicArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",
      messageId: "f2a02b45-0ecb-566c-9616-70e680d73f8c",
      messageAttributes: { test: { Type: "String", Value: "test" } }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.802Z",
    serviceKey: "SnsTopic#MyTopicNo1",
    data: {
      spyEventType: "SnsTopic",
      message: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      subject: null,
      timestamp: "2022-09-20T09:46:04.607Z",
      topicArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",
      messageId: "f2a02b45-0ecb-566c-9616-70e680d73f8c",
      messageAttributes: { test: { Type: "String", Value: "test" } }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.771Z",
    serviceKey: "Sqs#MyQueueNo1",
    data: {
      spyEventType: "Sqs",
      body: {
        Type: "Notification",
        MessageId: "f2a02b45-0ecb-566c-9616-70e680d73f8c",
        TopicArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",
        Message: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
        Timestamp: "2022-09-20T09:46:04.607Z",
        SignatureVersion: "1",
        Signature: "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",
        SigningCertURL: "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",
        UnsubscribeURL: "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",
        MessageAttributes: { test: { Type: "String", Value: "test" } }
      },
      messageAttributes: {}
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.808Z",
    serviceKey: "SnsSubscription#MyTopicNo1#FromSnsToSqsAndS3",
    data: {
      spyEventType: "SnsSubscription",
      message: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      subject: null,
      timestamp: "2022-09-20T09:46:04.607Z",
      topicArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",
      messageId: "f2a02b45-0ecb-566c-9616-70e680d73f8c",
      messageAttributes: { test: { Type: "String", Value: "test" } }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.903Z",
    serviceKey: "Function#FromSnsToSqsAndS3#Request",
    data: {
      request: {
        Records: [
          {
            EventSource: "aws:sns",
            EventVersion: "1.0",
            EventSubscriptionArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679",
            Sns: {
              Type: "Notification",
              MessageId: "f2a02b45-0ecb-566c-9616-70e680d73f8c",
              TopicArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",
              Subject: null,
              Message: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
              Timestamp: "2022-09-20T09:46:04.607Z",
              SignatureVersion: "1",
              Signature: "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",
              SigningCertUrl: "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",
              UnsubscribeUrl: "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679",
              MessageAttributes: { test: { Type: "String", Value: "test" } }
            }
          }
        ]
      },
      context: {
        functionName: "ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj",
        awsRequestId: "9323981d-674b-427e-b639-4cc26158c69f"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:04.942Z",
    serviceKey: "Function#FromSnsToSqsAndS3#Response",
    data: {
      request: {
        Records: [
          {
            EventSource: "aws:sns",
            EventVersion: "1.0",
            EventSubscriptionArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679",
            Sns: {
              Type: "Notification",
              MessageId: "f2a02b45-0ecb-566c-9616-70e680d73f8c",
              TopicArn: "arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",
              Subject: null,
              Message: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
              Timestamp: "2022-09-20T09:46:04.607Z",
              SignatureVersion: "1",
              Signature: "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",
              SigningCertUrl: "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",
              UnsubscribeUrl: "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:076585967075:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679",
              MessageAttributes: { test: { Type: "String", Value: "test" } }
            }
          }
        ]
      },
      response: { message: "Hello undefined" },
      context: {
        functionName: "ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj",
        awsRequestId: "9323981d-674b-427e-b639-4cc26158c69f"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.088Z",
    serviceKey: "Sqs#MyQueueNo2",
    data: {
      spyEventType: "Sqs",
      body: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      messageAttributes: {
        WeeksOn: {
          stringValue: "6",
          stringListValues: [],
          binaryListValues: [],
          dataType: "Number"
        },
        Author: {
          stringValue: "John Grisham",
          stringListValues: [],
          binaryListValues: [],
          dataType: "String"
        },
        Title: {
          stringValue: "The Whistler",
          stringListValues: [],
          binaryListValues: [],
          dataType: "String"
        }
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.107Z",
    serviceKey: "Function#FromSqsToEventBridge#Request",
    data: {
      request: {
        Records: [
          {
            messageId: "6297232e-203b-4776-a811-c5816ee24404",
            receiptHandle: "AQEBNeroB8TFlND6RVnj+vUPAqep/xWY4u7EI4tJURkfPfQPFWmW3g7OtbxLbYXwPVie0ccukt7QP6VB8sFjwSA/oPc3W1pcydJn19GFfrNDeXtZJUPwolV6Ng6D/5Kq9YGBm4G5cnRPg8OXlVZTwjPp4atFRrNh2BSIe2dTURJNK7Okdz+gza5JWwZ/6Lbjw61NAJuMiqCw7ZjN1n3KYvD/cT0DcOWUCnZRoiovYw7mQ+hbm5Vas1WArdF31o6TukwYuA0begjbAbje+udaVjOW6ThjLyvOTWsoxg0CfbVZK4ZaWYWgd7xyd8WOGf1QOKVNMv9elCQi0olC5MAMv/f9B3Kudd6l1RIiQIKaj0LZjf7pn3wsv3TPc85Z+9p3k9hSc++zSsPxN9g8hymZW/rviQlRTzEqSPggJvBr9/nzKcAn3+w20zxquodAJnlobRCY",
            body: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
            attributes: {
              ApproximateReceiveCount: "1",
              AWSTraceHeader: "Root=1-63298bdc-40943faf493e196b4e07459c;Parent=34ad705e0750956d;Sampled=0",
              SentTimestamp: "1663667164855",
              SenderId: "AROARDVHBDXRVFXDSOJAT:ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj",
              ApproximateFirstReceiveTimestamp: "1663667164856"
            },
            messageAttributes: {
              WeeksOn: {
                stringValue: "6",
                stringListValues: [],
                binaryListValues: [],
                dataType: "Number"
              },
              Author: {
                stringValue: "John Grisham",
                stringListValues: [],
                binaryListValues: [],
                dataType: "String"
              },
              Title: {
                stringValue: "The Whistler",
                stringListValues: [],
                binaryListValues: [],
                dataType: "String"
              }
            },
            md5OfMessageAttributes: "d25a6aea97eb8f585bfa92d314504a92",
            md5OfBody: "c64b00e6b5eb62c5f39cf4e7b1f4bbd7",
            eventSource: "aws:sqs",
            eventSourceARN: "arn:aws:sqs:eu-west-1:076585967075:ServerlessSpyE2e-MyQueueNo27A959A93-MwJqK7Urit97",
            awsRegion: "eu-west-1"
          }
        ]
      },
      context: {
        functionName: "ServerlessSpyE2e-FromSqsToEventBridgeE78842BE-VAz1SGd6qaR6",
        awsRequestId: "e0868330-80ce-59a7-8d77-d8930ec34d78"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.131Z",
    serviceKey: "Function#FromSqsToEventBridge#Response",
    data: {
      request: {
        Records: [
          {
            messageId: "6297232e-203b-4776-a811-c5816ee24404",
            receiptHandle: "AQEBNeroB8TFlND6RVnj+vUPAqep/xWY4u7EI4tJURkfPfQPFWmW3g7OtbxLbYXwPVie0ccukt7QP6VB8sFjwSA/oPc3W1pcydJn19GFfrNDeXtZJUPwolV6Ng6D/5Kq9YGBm4G5cnRPg8OXlVZTwjPp4atFRrNh2BSIe2dTURJNK7Okdz+gza5JWwZ/6Lbjw61NAJuMiqCw7ZjN1n3KYvD/cT0DcOWUCnZRoiovYw7mQ+hbm5Vas1WArdF31o6TukwYuA0begjbAbje+udaVjOW6ThjLyvOTWsoxg0CfbVZK4ZaWYWgd7xyd8WOGf1QOKVNMv9elCQi0olC5MAMv/f9B3Kudd6l1RIiQIKaj0LZjf7pn3wsv3TPc85Z+9p3k9hSc++zSsPxN9g8hymZW/rviQlRTzEqSPggJvBr9/nzKcAn3+w20zxquodAJnlobRCY",
            body: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
            attributes: {
              ApproximateReceiveCount: "1",
              AWSTraceHeader: "Root=1-63298bdc-40943faf493e196b4e07459c;Parent=34ad705e0750956d;Sampled=0",
              SentTimestamp: "1663667164855",
              SenderId: "AROARDVHBDXRVFXDSOJAT:ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj",
              ApproximateFirstReceiveTimestamp: "1663667164856"
            },
            messageAttributes: {
              WeeksOn: {
                stringValue: "6",
                stringListValues: [],
                binaryListValues: [],
                dataType: "Number"
              },
              Author: {
                stringValue: "John Grisham",
                stringListValues: [],
                binaryListValues: [],
                dataType: "String"
              },
              Title: {
                stringValue: "The Whistler",
                stringListValues: [],
                binaryListValues: [],
                dataType: "String"
              }
            },
            md5OfMessageAttributes: "d25a6aea97eb8f585bfa92d314504a92",
            md5OfBody: "c64b00e6b5eb62c5f39cf4e7b1f4bbd7",
            eventSource: "aws:sqs",
            eventSourceARN: "arn:aws:sqs:eu-west-1:076585967075:ServerlessSpyE2e-MyQueueNo27A959A93-MwJqK7Urit97",
            awsRegion: "eu-west-1"
          }
        ]
      },
      response: { message: "Hello undefined" },
      context: {
        functionName: "ServerlessSpyE2e-FromSqsToEventBridgeE78842BE-VAz1SGd6qaR6",
        awsRequestId: "e0868330-80ce-59a7-8d77-d8930ec34d78"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.319Z",
    serviceKey: "EventBridgeRule#MyEventBus#MyEventBridge",
    data: {
      spyEventType: "EventBridgeRule",
      detail: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      detailType: "test",
      source: "test-source",
      time: "2022-09-20T09:46:05Z",
      account: "076585967075"
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.379Z",
    serviceKey: "EventBridge#MyEventBus",
    data: {
      spyEventType: "EventBridge",
      detail: { id: "057f544b-7f90-496c-8006-3043dec54620", message: "Hello" },
      detailType: "test",
      source: "test-source",
      time: "2022-09-20T09:46:05Z",
      account: "076585967075"
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.504Z",
    serviceKey: "Function#ReceiveEventBridge#Request",
    data: {
      request: {
        version: "0",
        id: "33549074-e48f-2857-f67c-263c621cde5c",
        "detail-type": "test",
        source: "test-source",
        account: "076585967075",
        time: "2022-09-20T09:46:05Z",
        region: "eu-west-1",
        resources: [],
        detail: {
          id: "057f544b-7f90-496c-8006-3043dec54620",
          message: "Hello"
        }
      },
      context: {
        functionName: "ServerlessSpyE2e-ReceiveEventBridge1A8F9A7B-1x4KLKDymCCn",
        awsRequestId: "32814437-2efb-4384-9cb5-a04ac9639345"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.543Z",
    serviceKey: "DynamoDB#MyTable",
    data: {
      spyEventType: "DynamoDB",
      eventName: "INSERT",
      newImage: {
        id: "057f544b-7f90-496c-8006-3043dec54620",
        pk: "057f544b-7f90-496c-8006-3043dec54620",
        message: "Hello"
      },
      keys: { pk: "057f544b-7f90-496c-8006-3043dec54620" }
    }
  },
  {
    timestamp: "2022-09-20T09:46:05.541Z",
    serviceKey: "Function#ReceiveEventBridge#Response",
    data: {
      request: {
        version: "0",
        id: "33549074-e48f-2857-f67c-263c621cde5c",
        "detail-type": "test",
        source: "test-source",
        account: "076585967075",
        time: "2022-09-20T09:46:05Z",
        region: "eu-west-1",
        resources: [],
        detail: {
          id: "057f544b-7f90-496c-8006-3043dec54620",
          message: "Hello"
        }
      },
      response: {
        version: "0",
        id: "33549074-e48f-2857-f67c-263c621cde5c",
        "detail-type": "test",
        source: "test-source",
        account: "076585967075",
        time: "2022-09-20T09:46:05Z",
        region: "eu-west-1",
        resources: [],
        detail: {
          id: "057f544b-7f90-496c-8006-3043dec54620",
          message: "Hello"
        }
      },
      context: {
        functionName: "ServerlessSpyE2e-ReceiveEventBridge1A8F9A7B-1x4KLKDymCCn",
        awsRequestId: "32814437-2efb-4384-9cb5-a04ac9639345"
      }
    }
  },
  {
    timestamp: "2022-09-20T09:46:06.313Z",
    serviceKey: "S3#MyBucket",
    data: {
      spyEventType: "S3",
      eventName: "ObjectCreated:Put",
      eventTime: "2022-09-20T09:46:04.914Z",
      bucket: "serverlessspye2e-mybucketf68f3ff0-fl5cf0ojrgtc",
      key: "057f544b-7f90-496c-8006-3043dec54620.json"
    }
  }
];

// cli/webServerlessSpy.ts
window.process = { env: {} };
function run() {
  const tableBody = document.getElementById("tableBody");
  const modalTime = document.getElementById("time");
  const modalServiceKey = document.getElementById("serviceKey");
  const modalData = document.getElementById("data");
  const spyMessages = [];
  const snsEventsByMessageId = {};
  const functionEventsByRequestId = {};
  const eventBridgeById = {};
  const serviceKeyFilterInput = document.getElementById(
    "serviceKeyFilter"
  );
  const dataFilterInput = document.getElementById(
    "dataFilter"
  );
  let uiNeedsRefresh = false;
  const detailsModal = new import_bootstrap.Modal("#detailsModal", {
    backdrop: true,
    keyboard: true
  });
  const render = () => {
    if (uiNeedsRefresh) {
      tableBody.innerHTML = spyMessages.map((sm) => renderSpyMessage(sm)).join("");
      uiNeedsRefresh = false;
    }
    window.requestAnimationFrame(render);
  };
  setupTooltip();
  serviceKeyFilterInput.addEventListener("input", () => {
    uiNeedsRefresh = true;
  });
  dataFilterInput.addEventListener("input", () => {
    uiNeedsRefresh = true;
  });
  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    const dataElements = row?.getElementsByClassName("data");
    const timeElements = row?.getElementsByClassName("time");
    const serviceKeyElements = row?.getElementsByClassName("serviceKey");
    if (!dataElements || dataElements.length === 0 || !timeElements || timeElements.length === 0 || !serviceKeyElements || serviceKeyElements.length === 0) {
      return;
    }
    const formatter = (0, import_json_format_highlight.default)(
      JSON.stringify(JSON.parse(dataElements[0].textContent || ""), null, 2),
      {
        keyColor: "black",
        numberColor: "blue",
        stringColor: "#0B7500",
        trueColor: "#00cc00",
        falseColor: "#ff8080",
        nullColor: "cornflowerblue"
      }
    );
    modalTime.innerHTML = timeElements[0].textContent || "";
    modalServiceKey.innerHTML = serviceKeyElements[0].textContent || "";
    modalData.innerHTML = formatter;
    detailsModal.show();
  });
  const url = "SERVERLESS_SPY_WS_URL";
  const ws = new WebSocket(url);
  ws.addEventListener("open", function(event) {
    console.log("connected " + new Date().toISOString());
  });
  ws.addEventListener("message", function({ data }) {
    console.log(data);
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (err) {
      console.error("Can not parse " + data);
    }
    addSpyMessage(parsed);
  });
  ws.addEventListener("close", function() {
    console.log("disconnected " + new Date().toISOString());
  });
  for (const sm of list) {
    addSpyMessage(sm);
  }
  window.requestAnimationFrame(render);
  function addSpyMessage(spyMessage) {
    const spyMessageExt = spyMessage;
    spyMessageExt.dataJsonLowerCase = JSON.stringify(
      spyMessageExt.data
    ).toLocaleLowerCase();
    spyMessageExt.serviceKeyLowerCase = spyMessageExt.serviceKey.toLocaleLowerCase();
    const service = getServiceName(spyMessageExt.serviceKey);
    let spyMessageToAdd = spyMessageExt;
    if (service === "Function") {
      const spyMessageFunction = spyMessageExt;
      const awsRequestId = spyMessageFunction.data.context.awsRequestId;
      let functionEvents = functionEventsByRequestId[awsRequestId];
      if (!functionEvents) {
        functionEvents = [];
        functionEventsByRequestId[awsRequestId] = functionEvents;
      }
      const step = getServiceKeyFunctionStep(spyMessageExt.serviceKey);
      if (step === "Request") {
        spyMessageToAdd = {
          timestamp: spyMessageExt.timestamp,
          serviceKey: spyMessageExt.serviceKey,
          messages: functionEvents
        };
        functionEvents.unshift(spyMessageFunction);
      } else {
        addSpyMessageSorted(spyMessageFunction, functionEvents);
        spyMessageToAdd = void 0;
      }
    } else if (service === "SnsSubscription" || service === "SnsTopic") {
      const spyMessageSns = spyMessageExt;
      const messageId = spyMessageSns.data.messageId;
      let snsEvents = snsEventsByMessageId[messageId];
      if (!snsEvents) {
        snsEvents = [];
        snsEventsByMessageId[messageId] = snsEvents;
      }
      if (service === "SnsTopic") {
        spyMessageToAdd = {
          timestamp: spyMessageExt.timestamp,
          serviceKey: spyMessageExt.serviceKey,
          messages: snsEvents
        };
        snsEvents.unshift(spyMessageSns);
      } else {
        addSpyMessageSorted(spyMessageSns, snsEvents);
        spyMessageToAdd = void 0;
      }
    } else if (service === "EventBridge" || service === "EventBridgeRule") {
      const spyMessageEventBridge = spyMessageExt;
      const eventBridgeId = spyMessageEventBridge.data.eventBridgeId;
      let eventBridgeEvents = eventBridgeById[eventBridgeId];
      if (!eventBridgeEvents) {
        eventBridgeEvents = [];
        eventBridgeById[eventBridgeId] = eventBridgeEvents;
      }
      if (service === "EventBridge") {
        spyMessageToAdd = {
          timestamp: spyMessageExt.timestamp,
          serviceKey: spyMessageExt.serviceKey,
          messages: eventBridgeEvents
        };
        eventBridgeEvents.unshift(spyMessageEventBridge);
      } else {
        addSpyMessageSorted(spyMessageEventBridge, eventBridgeEvents);
        spyMessageToAdd = void 0;
      }
    }
    if (spyMessageToAdd) {
      addSpyMessageSorted(spyMessageToAdd, spyMessages);
      uiNeedsRefresh = true;
    }
  }
  function matchFilter(spyMessage, filter) {
    let testServiceKey = false;
    try {
      testServiceKey = !filter.serviceKey || new RegExp(filter.serviceKey).test(spyMessage.serviceKeyLowerCase);
    } catch {
    }
    let testData = false;
    try {
      testData = !filter.data || new RegExp(filter.data).test(spyMessage.dataJsonLowerCase);
    } catch {
    }
    return testServiceKey && testData;
  }
  function getServiceKeyFunctionStep(serviceKey) {
    const serviceKeyParts = serviceKey.split("#");
    const step = serviceKeyParts.length > 0 ? serviceKeyParts[serviceKeyParts.length - 1] : void 0;
    return step;
  }
  function renderSpyMessage(spyMessage) {
    const serviceKey = serviceKeyFilterInput.value?.toLocaleLowerCase();
    const data = dataFilterInput.value?.toLocaleLowerCase();
    let messages;
    if (spyMessage.messages) {
      messages = spyMessage.messages;
    } else {
      messages = [spyMessage];
    }
    const html = messages.filter((sm) => matchFilter(sm, { serviceKey, data })).map((sm, i) => {
      const service = getServiceName(sm.serviceKey);
      let icon;
      let iconLinked = '<i class="icon-linked bi bi-arrow-return-right"></i>';
      switch (service) {
        case "Function":
          const step = getServiceKeyFunctionStep(sm.serviceKey);
          if (i === 0) {
            icon = `<img class="aws-icon" src="icons/Arch_AWS-Lambda_16.svg" ></img>`;
          } else {
            icon = iconLinked;
          }
          break;
        case "S3":
          icon = '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Storage-Service_16.svg"/>';
          break;
        case "SnsTopic":
          icon = '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Notification-Service_16.svg" />';
          break;
        case "EventBridge":
          icon = '<img class="aws-icon" src="icons/Arch_Amazon-EventBridge_16.svg" />';
          break;
        case "DynamoDB":
          icon = '<img class="aws-icon" src="icons/Arch_Amazon-DynamoDB_16.svg" />';
          break;
        case "Sqs":
          icon = '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Queue-Service_16.svg" />';
          break;
        case "EventBridgeRule":
          if (i === 0) {
            icon = '<img class="aws-icon" src="icons/Arch_Amazon-EventBridge_16.svg" />';
          } else {
            icon = iconLinked;
          }
          break;
        case "SnsSubscription":
          if (i === 0) {
            icon = '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Notification-Service_16.svg" />';
          } else {
            icon = iconLinked;
          }
          break;
        default:
          break;
      }
      return `<tr>
    <td class="col-time"><span class="time">${new Date(
        sm.timestamp
      ).toISOString()}</span></td>
    <td class="col-servicekey">${icon}<span class="serviceKey">${sm.serviceKey}</span></td>
    <td class="col-data"><div class="data">${JSON.stringify(
        sm.data
      )}</div></td></tr>
  
    `;
    }).join("");
    return html;
  }
  function getServiceName(serviceKey) {
    const serviceKeyParts = serviceKey.split("#");
    const service = serviceKeyParts.length > 0 ? serviceKeyParts[0] : void 0;
    return service;
  }
}
document.addEventListener("DOMContentLoaded", function() {
  console.log("RUN");
  run();
});
function setupTooltip() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new import_bootstrap.Tooltip(tooltipTriggerEl);
  });
}
function addSpyMessageSorted(spyMessageToAdd, spyMessages) {
  let index = 0;
  for (let i = spyMessages.length - 1; i >= 0; i--) {
    const currentSpyMessages = spyMessages[i];
    index = i + 1;
    if (i === 0 || currentSpyMessages.timestamp < spyMessageToAdd.timestamp) {
      break;
    }
  }
  spyMessages.splice(index, 0, spyMessageToAdd);
}
/*!
  * Bootstrap v5.2.1 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
//# sourceMappingURL=webServerlessSpy.js.map
