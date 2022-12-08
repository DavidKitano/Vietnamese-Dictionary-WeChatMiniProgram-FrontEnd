import {
	createSSRApp
} from "vue";
import qiunDataCharts from './components/qiun-data-charts/qiun-data-charts.vue'
export default qiunDataCharts;
import './utils/userApi.js'
import './utils/studyApi.js'
import './utils/newsApi.js'
import './utils/utils.js'
// import './static/h5/echarts.min.js'
// import './static/app-plus/echarts.min.js'
// import './components/u-charts/config-echarts.js'
// import './components/u-charts/config-ucharts.js'
// import './components/u-charts/u-charts.js'
import './components/u-charts/u-charts.min.js'
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
