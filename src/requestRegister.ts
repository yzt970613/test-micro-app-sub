import request, { RequestConfig } from '@kt/request';
import { AxiosRequestConfig } from 'axios';
import { App } from 'vue';
import { Modal, message } from 'ant-design-vue';
import router from './router';
// import Cookies from 'js-cookie';
import { Loading } from '@kt/unity-components';

const config: RequestConfig = {
  nodeEnv: process.env.NODE_ENV,
  customEnv: process.env.MY_ENV,
  showModal(message) {
    Modal.destroyAll();

    Modal.error({
      title: '系统提示',
      content: message,
      okText: '确定',
      onOk() {
        Modal.destroyAll();
      }
    });
  },
  showToast(_message) {
    message.error(_message);
  },
  showLoading: {
    show() {
      Loading.show();
    },
    hide() {
      Loading.hide();
    }
  },
  strategies: {
    FOO() {},
    /**
     * 业务逻辑异常
     */
    BUSINESS_ERROR({
      branch,
      data,
      config,
      codeKey,
      codeValue,
      msgKey,
      showToast
    }) {
      const message = data[msgKey] || '系统异常，请稍后再试';
      if (data[codeKey] === codeValue) {
        config.codeErrTip && showToast(message);
      }
    },
    /**
     * 没有授权登录
     */
    NOT_AUTH({ data, config, codeKey, codeValue, showToast }) {
      if (!config.customAuth) return;
      const message = '用户未登录，请先登录';
      if (data[codeKey] === codeValue) {
        showToast(message);
        router.replace({ path: '/login' });
      }
    },
    /**
     * 登录超时
     */
    INVALID_TOKEN({ data, codeKey, codeValue, config, showToast }) {
      if (!config.customAuth) return;
      const message = '用户登录超时，请重新登录';
      if (data[codeKey] === codeValue) {
        showToast(message);
        router.replace({ path: '/login' });
      }
    },
    /**
     * 权限不足
     */
    PERMISSION_DENIED({ data, codeKey, codeValue, showModal }) {
      const message = '权限不足，请您联系管理员';
      if (data[codeKey] === codeValue) {
        showModal(message);
      }
    },
    // 系统异常
    SYSTEM_ERROR({ data, codeKey, codeValue, showModal }) {
      const message = '系统异常，请稍后再试';
      if (data[codeKey] === codeValue) {
        showModal(message);
      }
    }
  },
  // 需要配置 isProxy 选项来判断是否需要使用 node 代理
  branches: {
    master: {
      origin: {
        test: 'https://ts.keytop.cn',
        prod: 'https://park.keytop.cn'
      },
      validator: [
        // {
        //   strategy: 'BUSINESS_ERROR',
        //   codeKey: 'code',
        //   // 0 正确，1表示错误
        //   codeValue: 5000,
        //   msgKey: 'message'
        // },
        {
          strategy: 'NOT_AUTH',
          codeKey: 'code',
          codeValue: 3000,
          msgKey: 'message'
        },
        // {
        //   strategy: 'INVALID_TOKEN',
        //   codeKey: 'code',
        //   codeValue: 3100,
        //   msgKey: 'message'
        // },
        {
          strategy: 'PERMISSION_DENIED',
          codeKey: 'code',
          codeValue: 5100,
          msgKey: 'message'
        },
        {
          strategy: 'SYSTEM_ERROR',
          codeKey: 'code',
          codeValue: 4000,
          msgKey: 'message'
        }
      ],
      // rewrite or add
      requestExtend: {
        /**
         * 重写 get 方法，为了告诉 TypeScript 这些新 property，我们可以使用[模块扩充](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。
         *
         * request.get2() 发起请求时，根据环境修改请求 url 的上下文
         */
        get2(path, data, config) {
          const context =
            process.env.NODE_ENV === 'development' ? 'test/' : 'prod/';
          return {
            ...config,
            method: 'GET',
            // 添加 url 前缀
            url: `${context}${path}`,
            params: data
          };
        },
        /**
         * 上传文件方法
         */
        upload(path, data, config) {
          const formData: FormData = new FormData();
          for (const key in data) {
            formData.append(key, data[key]);
          }
          data = formData;
          return {
            ...config,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            url: path,
            data
          };
        }
      }
    },
    sifou: {
      origin: {
        test: 'https://segmentfault.com',
        prod: 'https://segmentfault.com'
      },
      // validator 可为空，就是跳过验证
      validator: [
        {
          strategy: 'BUSINESS_ERROR',
          codeKey: 'status',
          // 0 正确，1表示错误
          codeValue: 1,
          // codeValue: 0,
          msgKey: 'message'
        }
      ],
      requestExtend: {
        get(path, data, config) {
          return {
            ...config,
            method: 'get',
            url: path,
            params: { ...data, sifou: 'sifou' }
          };
        }
      }
    },
    jianshu: {
      origin: {
        test: 'https://www.jianshu.com',
        prod: 'https://www.jianshu.com'
      }
      // validator: []
    }
  }
};
const requestRegister = (app: App) => {
  app.use(request, config);

  // #region 实例拦截器配置
  const sharedInterceptorsRequest = (config: AxiosRequestConfig) => {
    // config.headers!['kt-token'] =
    //   Cookies.get('kt-token')! || localStorage.getItem('kt-token')!;
    // config.headers!['KT_LOT_ID'] = localStorage.getItem('KT_LOT_ID') || '';
    return config;
  };
  // 配置实例拦截器，与 axios 的配置一致
  request.interceptors.request.use(sharedInterceptorsRequest);
  request.sifou.interceptors.request.use(sharedInterceptorsRequest);
  request.jianshu.interceptors.request.use(sharedInterceptorsRequest);
  // #endregion
};
export default requestRegister;
