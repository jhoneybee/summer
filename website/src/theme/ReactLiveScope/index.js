/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { AiOutlineUser } from "react-icons/ai";

import { Button } from '@summer/button'
// import DropDown, { DropDownMenu, DropDownMenuItem } from '../../../components/dropdown';

import { DropDown } from '@summer/dropdown'
import { Input } from '@summer/input';
import Select, { SelectOption } from '../../../components/select';
import Password from '../../../components/password';
import Message, { info, error } from '../../../components/message';
import Checkbox from '../../../components/checkbox';
import DatePicker, { DatePickerPanel } from '../../../components/date-picker';
import RadioGroup, { Radio } from '../../../components/radio';
import Tabs, { TabPane } from '../../../components/tabs';
import Tree, { TreeNode, processDragDropTreeNode } from '../../../components/tree';
import Modal from '../../../components/modal';
import Space from '../../../components/space';
import Table, { Column } from '../../../components/table/table';

const ReactLiveScope = {
    React,
    ...React,
    Button,
    DropDown,
    Input,
    Select,
    SelectOption,
    Password,
    Message,
    info,
    error,
    Checkbox,
    AiOutlineUser,
    DatePicker,
    DatePickerPanel,
    RadioGroup,
    Radio,
    Tabs,
    TabPane,
    Tree,
    TreeNode,
    processDragDropTreeNode,
    Modal,
    Space,
    Table,
    Column
};

export default ReactLiveScope;