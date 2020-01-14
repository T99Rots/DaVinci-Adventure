import { Router } from 'schema-router';

const getParam = (param) => ({ params }) => params && params[param];

const router = window.router = new Router({
  default: {
    title: ({id}) => id[0].toLocaleUpperCase()+id.substr(1).toLocaleLowerCase(),
    script: ({id}) => `../views/${id}.js`,
    tagName: a => a.id ? `${a.id}-page` : false,
    redirect: () => localStorage.getItem('loggedIn')? false: { id: 'login' },
    header: true
  },
  root: {
    id: 'root',
    redirect: () => ({
      id: localStorage.getItem('loginType') === 'admin'? 'templates': 'adventure'
    })
  },
  404: {
    tagName: 'page-404',
    id: '404',
    title: 'Page not found'
  },
  routes: {
		login: {
      id: 'login',
      redirect: () => localStorage.getItem('loggedIn')? { id: 'root' }: false,
      header: false
    },
    templates: {
      id: 'templates',
      title: 'Game Templates',
      subRoutes: {
        ':templateId': {
          id: 'template',
          title: 'Template'
        }
      } 
    },
    'adventure-admin-dashboard': {
      id: 'adventure-admin-dashboard'
    },
    'adventure': {
      id: 'adventure',
      header: false
    }
  }
});

export { router };