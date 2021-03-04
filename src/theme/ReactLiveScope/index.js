/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Button from '../../../components/button'
import DropDown, { DropDownMenu, DropDownMenuItem } from '../../../components/dropdown';

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  Button,
  DropDown,
  DropDownMenu,
  DropDownMenuItem
};

export default ReactLiveScope;
