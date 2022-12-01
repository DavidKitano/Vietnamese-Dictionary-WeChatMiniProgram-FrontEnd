import {
	createSSRApp
} from "vue";
import './utils/userApi.js'
import { promisifyAll } from 'miniprogram-api-promise'
import App from "./App.vue";

// Promise化
const wxp = wx.p = {}
promisifyAll(wx, wxp)

export function createApp() {
	const app = createSSRApp(App);

	return {
		app,
	};
}
