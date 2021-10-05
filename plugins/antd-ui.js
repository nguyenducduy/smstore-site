import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';

import {
  DatePicker,
  Modal,
  Avatar,
  TreeSelect,
  Rate,
  Breadcrumb,
  InputNumber,
  Button,
  Layout,
  Table,
  Icon,
  Radio,
  Dropdown,
  Menu,
  Input,
  Badge,
  Form,
  Tooltip,
  Select,
  Switch,
  Tag,
  Spin,
  Space,
  Checkbox,
  Tabs,
  Pagination,
  notification,
  message,
  Drawer,
  Result,
  Popconfirm,
  BackTop,
  Collapse,
  Card,
  Timeline,
  Alert,
  Progress,
  Popover,
} from "ant-design-vue";

Vue.use(Popover);
Vue.use(Progress);
Vue.use(Alert);
Vue.use(DatePicker);
Vue.use(Modal);
Vue.use(Avatar);
Vue.use(TreeSelect);
Vue.use(Button);
Vue.use(Rate);
Vue.use(Breadcrumb);
Vue.use(Layout);
Vue.use(Table);
Vue.use(Icon);
Vue.use(Radio);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Input);
Vue.use(Badge);
Vue.use(Form);
Vue.use(Tooltip);
Vue.use(Select);
Vue.use(Tag);
Vue.use(Spin);
Vue.use(Space);
Vue.use(Checkbox);
Vue.use(Tabs);
Vue.use(Pagination);
Vue.use(InputNumber);
Vue.use(Drawer);
Vue.use(Switch);
Vue.use(Result);
Vue.use(Popconfirm);
Vue.use(BackTop);
Vue.use(Card);
// Vue.use(CardGrid);
Vue.use(Collapse);
Vue.use(Timeline);

  //notification
Vue.prototype.$notification = notification;
Vue.prototype.$message = message;