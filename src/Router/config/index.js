import Layout from '../Layout';

import { Index, System } from '../../View/';

export default [
    {
        path: '/',
        // redirect: '/dashboard/welcome',
        component: Index,
        exact: true,
    },
    {
        path: '*',
        component: System.NotFound,
    },
];
