/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";

import { Button } from '@jhoneybee/button'
import { DropDown } from '@jhoneybee/dropdown'
import { Input } from '@jhoneybee/input';
import { Table, Column } from '@jhoneybee/table'
import { Checkbox } from '@jhoneybee/checkbox';
import { Space } from '@jhoneybee/space';
import Message, { info, error } from '@jhoneybee/message';
import DatePicker, { DatePickerPanel } from '@jhoneybee/datepicker';
import { Password } from '@jhoneybee/password';
import RadioGroup, { Radio } from '@jhoneybee/radio';
import Tree, { TreeNode, processDragDropTreeNode } from '@jhoneybee/tree';
import Tabs, { TabPane } from '@jhoneybee/tabs';
import Modal from '@jhoneybee/modal';
import Select, { SelectOption } from '@jhoneybee/select';


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
    AiOutlineSetting,
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
