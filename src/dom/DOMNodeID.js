/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMNodeID
 * @typechecks
 */

"use strict";

var ReactDOMNodeCache = require("ReactDOMNodeCache");

// This should remain the only place in the codebase that cares (or
// directly knows) what the name of the ID attribute actually is.
var ID_ATTR_NAME = "id";

/**
 * Accessing domNode[ID_ATTR_NAME] or calling getAttribute(ID_ATTR_NAME)
 * on a form element can return its control whose name or ID equal to
 * ID_ATTR_NAME. All DOM nodes support `getAttributeNode` but this can
 * also get called on other objects so just return '' if we're given
 * something other than a DOM node (such as window).
 *
 * @param {DOMElement|DOMWindow|DOMDocument} domNode DOM node.
 * @returns {string} ID of the supplied `domNode`.
 */
function get(domNode) {
  if (domNode && domNode.getAttributeNode) {
    var attributeNode = domNode.getAttributeNode(ID_ATTR_NAME);
    return attributeNode && attributeNode.value || '';
  }
  return '';
}
exports.get = get;

/**
 * Set the React-specific ID of a given node.
 *
 * This also updates ReactDOMNodeCache, so that we don't have to traverse
 * the DOM in most cases to find nodes.
 *
 * @param {DOMElement|DOMWindow|DOMDocument} domNode DOM node.
 * @param {string} id React-specific ID to be assigned.
 */
exports.set = function(domNode, id) {
  var oldID = get(domNode);
  domNode.setAttribute(ID_ATTR_NAME, id);
  if (oldID) {
    ReactDOMNodeCache.purgeID(oldID);
  }
  ReactDOMNodeCache.primeID(id, domNode);
};
