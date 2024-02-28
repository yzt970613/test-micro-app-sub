import '@kt/unity-micro-app-resource/public-path';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import i18n from './locale';
import Modal from '@kt/unity-antd-modal';
import Table from '@kt/unity-antd-table';
import Form from '@kt/unity-antd-form';
import Empty from '@kt/unity-antd-empty';

import TableLayout from '@kt/unity-table-layout';
import { setUseTableGlobalOptions } from '@kt/unity-hooks';
import '@/assets/css/tailwind.less';

import {
  ConfigProvider,
  Button,
  Spin,
  Statistic,
  Input,
  Radio,
  Badge,
  Pagination,
  Calendar,
  DatePicker,
  Layout,
  Menu,
  Alert,
  Card,
  Select,
  Row,
  Col,
  Tag,
  Checkbox,
  Dropdown,
  Tooltip,
  Popover,
  InputNumber,
  Switch,
  Image,
  Progress,
  Tabs,
  Result,
  Upload,
  Timeline,
  Collapse
} from 'ant-design-vue';

import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  PoweroffOutlined,
  DownOutlined,
  ReloadOutlined,
  RollbackOutlined,
  EditOutlined,
  LockOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  BarcodeOutlined,
  TableOutlined,
  SettingOutlined,
  SmileOutlined,
  LaptopOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  FileSearchOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';

import requestRegister from './requestRegister';
// import microAppRegister from './microAppRegister';

const app = createApp(App);
// #region 注册全局插件
const plugins: any = {
  router,
  pinia: createPinia(),
  i18n,
  ConfigProvider,
  Button,
  Spin,
  Form,
  Empty,
  Statistic,
  Input,
  Radio,
  Badge,
  Pagination,
  Calendar,
  DatePicker,
  Layout,
  Menu,
  Alert,
  Card,
  Select,
  Row,
  Col,
  Tag,
  Checkbox,
  Dropdown,
  Tooltip,
  Popover,
  InputNumber,
  Switch,
  Image,
  Progress,
  Tabs,
  Result,
  Upload,
  Timeline,
  Collapse
};
// #endregion

// #region 注册全局antd icon
const globalAntdIcons: any[] = [
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  PoweroffOutlined,
  DownOutlined,
  ReloadOutlined,
  RollbackOutlined,
  EditOutlined,
  LockOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  BarcodeOutlined,
  TableOutlined,
  SettingOutlined,
  SmileOutlined,
  LaptopOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  FileSearchOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
];
// #endregion

Object.keys(plugins).forEach(key => {
  app.use(plugins[key]);
});

globalAntdIcons.forEach((comp: any) => {
  app.component(comp.displayName, comp);
});

// 注册 Modal
app.use(Modal as any, {
  props: {
    // 是否显示右上角的关闭按钮
    closable: true,
    // 是否支持键盘 esc 关闭
    keyboard: false,
    // 点击蒙层是否允许关闭
    maskClosable: false
  }
});

// 注册 Table
app.use(Table, {
  props: {
    bordered: true,
    column: { align: 'left' },
    size: 'small',
    pagination: {
      size: 'small',
      // 显示总条数和当前范围，null 表示不显示，eg：showTotal: (total, range) => `共 ${total} 条`,
      showTotal: (total: number, range: number) => `共 ${total} 条`,
      hideOnSinglePage: false,
      showQuickJumper: true,
      showSizeChanger: true
    },
    scroll: {
      scrollToFirstRowOnChange: true,
      /**
       * scroll.y='auto' 结合 tableLayout 高度充满外层容器，且限制滚动只在 table 的 body
       * 如果需要关闭这个行为，则配置 tableLayout :fixed=false
       */
      y: 'auto'
    }
  }
});

app.use(TableLayout);

setUseTableGlobalOptions({
  dataSourceKey: ['data', 'vos'],
  totalKey: ['data', 'total'],
  currentKey: 'currentPage',
  pageSizeKey: 'pageSize',
  pageSize: 20
});

// request 注册相关
requestRegister(app);

// app.config.globalProperties.$prefix = 'nkc';

app.mount('#app');

// micro-app 作为子应用需要初始化相关
// microAppRegister(app);
