import { __ } from '~/locale';
import { generateToolbarItem } from './toolbar_service';

/* eslint-disable @gitlab/require-i18n-strings */
const TOOLBAR_ITEM_CONFIGS = [
  { icon: 'heading', event: 'openHeadingSelect', classes: 'tui-heading', tooltip: __('Headings') },
  { icon: 'bold', command: 'Bold', tooltip: __('Add bold text') },
  { icon: 'italic', command: 'Italic', tooltip: __('Add italic text') },
  { icon: 'strikethrough', command: 'Strike', tooltip: __('Add strikethrough text') },
  { isDivider: true },
  { icon: 'quote', command: 'Blockquote', tooltip: __('Insert a quote') },
  { icon: 'link', event: 'openPopupAddLink', tooltip: __('Add a link') },
  { icon: 'doc-code', command: 'CodeBlock', tooltip: __('Insert a code block') },
  { isDivider: true },
  { icon: 'list-bulleted', command: 'UL', tooltip: __('Add a bullet list') },
  { icon: 'list-numbered', command: 'OL', tooltip: __('Add a numbered list') },
  { icon: 'list-task', command: 'Task', tooltip: __('Add a task list') },
  { icon: 'list-indent', command: 'Indent', tooltip: __('Indent') },
  { icon: 'list-outdent', command: 'Outdent', tooltip: __('Outdent') },
  { isDivider: true },
  { icon: 'dash', command: 'HR', tooltip: __('Add a line') },
  { icon: 'table', event: 'openPopupAddTable', classes: 'tui-table', tooltip: __('Add a table') },
  { isDivider: true },
  { icon: 'code', command: 'Code', tooltip: __('Insert inline code') },
];

export const EDITOR_OPTIONS = {
  toolbarItems: TOOLBAR_ITEM_CONFIGS.map(config => generateToolbarItem(config)),
};

export const EDITOR_TYPES = {
  wysiwyg: 'wysiwyg',
};

export const EDITOR_HEIGHT = '100%';

export const EDITOR_PREVIEW_STYLE = 'horizontal';
