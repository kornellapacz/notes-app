import { createWebHistory, createRouter } from 'vue-router';
import LoginPage from "./pages/LoginPage.vue";
import NotesPage from "./pages/notes/index.vue";
import CreateNotePage from "./pages/notes/Create.vue";
import store from './store';

const routes = [
	{
		path: '/',
		component: NotesPage,
		name: 'notes',
	},
	{
		path: '/create',
		component: CreateNotePage,
		name: 'notes.create',
	},

	{
		path: '/login',
		component: LoginPage,
		name: 'login',
		meta: {
			isUnprotected: true
		}
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach((to, from, next) => {
	if (!to.meta.isUnprotected && !store.getters.isLoged) next({ name: 'login' })
	else next()
})

export default router;
