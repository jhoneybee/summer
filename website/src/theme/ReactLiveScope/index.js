/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";

import { Button } from '@jhonebee/button'
import { DropDown } from '@jhonebee/dropdown'
import { Input } from '@jhonebee/input';
import { Table, Column } from '@jhonebee/table'
import { Checkbox } from '@jhonebee/checkbox';
import { Space } from '@jhonebee/space';
import Message, { info, error } from '@jhonebee/message';
import DatePicker, { DatePickerPanel } from '@jhonebee/datepicker';
import { Password } from '@jhonebee/password';
import RadioGroup, { Radio } from '@jhonebee/radio';
import Tree, { TreeNode, processDragDropTreeNode } from '@jhonebee/tree';
import Tabs, { TabPane } from '@jhonebee/tabs';
import Modal from '@jhonebee/modal';
import Select, { SelectOption } from '@jhonebee/select';


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
