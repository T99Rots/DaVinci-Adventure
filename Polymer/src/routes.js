import { Router } from 'schema-router';

const getParam = (param) => ({ params }) => params && params[param];

const router = window.router = new Router({
  default: {
    title: ({id}) => id[0].toLocaleUpperCase()+id.substr(1).toLocaleLowerCase(),
    script: ({id}) => `../views/${id}.js`,
    tagName: a => a.id ? `${a.id}-page` : false,
  },
  root: {
    id: 'home',
    redirect: {
      id: 'dashboard'
    }
  },
  404: {
    tagName: 'page-404',
    id: '404',
    title: 'Page not found'
  },
  routes: {
		login: {
      id: 'login'
    },
    dashboard: {
      id: 'dashboard'
    }
  }
});

export { router };