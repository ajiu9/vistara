<template>
	<div id="canvasDiv" class="canvas-content">
		<div class="ctrl" :class="{ 'ctrl-rotate': 'isRotate' }">
			<div class="scale-btn" @click="roratePdf">
				<i class="iconfont icon-xuanzhuan"></i>
			</div>
			<div class="scale-btn" @click="scalePDF('add')">＋</div>
			<div class="scale-btn" @click="scalePDF">－</div>
		</div>
	</div>
</template>

<script>
import {
	getCurrentInstance,
	nextTick,
	onBeforeMount,
	onBeforeUnmount,
	onMounted,
	reactive,
	ref,
	shallowRef
} from 'vue'
// import { calculateOld } from 'tool'
import enMap from './index-en'
import cnMap from './index-cn'

let PDF
export default {
	name: 'PdfViewer',
	props: {
		url: {
			type: String,
			default: ''
		}
	},
	setup(props) {
		const { proxy } = getCurrentInstance()
		// const pdfBase64 =
		// 	'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L0ZvbnQvU3VidHlwZS9DSURGb250VHlwZTAvQmFzZUZvbnQvU1RTb25nLUxpZ2h0L0ZvbnREZXNjcmlwdG9yIDYgMCBSL1cgWzFbMjA3XTkgMTAgMzc0IDE0WzM3NSAyMzhdMTcgMjYgNDYyIDI3WzIzOF0zNls2OTVdNDZbODk2XTUyWzQ2NSA2MDddNTdbNjQ3IDYyMCA2MDddXS9EVyAxMDAwL0NJRFN5c3RlbUluZm88PC9SZWdpc3RyeShBZG9iZSkvT3JkZXJpbmcoR0IxKS9TdXBwbGVtZW50IDQ+Pj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUwL0Jhc2VGb250L1NUU29uZy1MaWdodC1VbmlHQi1VQ1MyLUgvRW5jb2RpbmcvVW5pR0ItVUNTMi1IL0Rlc2NlbmRhbnRGb250c1s3IDAgUl0+PgplbmRvYmoKMSAwIG9iago8PC9UeXBlL1hPYmplY3QvU3VidHlwZS9Gb3JtL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSAyIDAgUj4+Pj4vQkJveFswIDAgNTAgNTBdL0Zvcm1UeXBlIDEvTWF0cml4IFsxIDAgMCAxIDAgMF0vTGVuZ3RoIDM5L0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCniccwrh0nczVDA0UAhJ49JgUGAwYFCYUaoZksXlGsKVwQUAYdcGVwplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbNSAwIFJdPj4KZW5kb2JqCjggMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSPj4KZW5kb2JqCjkgMCBvYmoKPDwvUHJvZHVjZXIoaVRleHSuIDUuNS4xMyCpMjAwMC0yMDE4IGlUZXh0IEdyb3VwIE5WIFwoQUdQTC12ZXJzaW9uXCkpL0NyZWF0aW9uRGF0ZShEOjIwMjAwNzAzMTAyNzM5KzA4JzAwJykvTW9kRGF0ZShEOjIwMjAwNzAzMTAyNzM5KzA4JzAwJyk+PgplbmRvYmoKeHJlZgowIDEwCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwNDg2MCAwMDAwMCBuIAowMDAwMDA0NzM2IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwNTA3MSAwMDAwMCBuIAowMDAwMDA0MTgyIDAwMDAwIG4gCjAwMDAwMDQyOTQgMDAwMDAgbiAKMDAwMDAwNDQ4NSAwMDAwMCBuIAowMDAwMDA1MTIyIDAwMDAwIG4gCjAwMDAwMDUxNjcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDEwL1Jvb3QgOCAwIFIvSW5mbyA5IDAgUi9JRCBbPGJhZGU5MDdlNGMxYzQzMjg3MDliZjI1MzFjNzlkOWMyPjxiYWRlOTA3ZTRjMWM0MzI4NzA5YmYyNTMxYzc5ZDljMj5dPj4KJWlUZXh0LTUuNS4xMwpzdGFydHhyZWYKNTMyNQolJUVPRgo='
		const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1
		const PDF_SCALE_MAX = 2 * DEVICE_PIXEL_RATIO
		const PDF_SCALE_MIN = 0.4 * DEVICE_PIXEL_RATIO
		const viewOption = reactive({
			scale: 0.6 * DEVICE_PIXEL_RATIO,
			rotation: 0 // 暂时先不加旋转， 手机自动旋转
		})
		const pdfView = shallowRef({}) // 缓存pdf数据
		const isRotate = ref(false) // 是否旋转

		// 添加canvas元素，每一页为一个canvas
		const addPage = (pageNumber, pageCount) => {
			pdfView.value.getPage(pageNumber).then(page => {
				const canvas = document.createElement('canvas') // 在页面中创建canvas
				canvas.id = 'canvas_' + pageNumber
				const el_canvasDiv = document.querySelector('#canvasDiv')
				el_canvasDiv.appendChild(canvas)

				const context = canvas.getContext('2d')
				const viewport = page.getViewport(viewOption)
				canvas.height = Math.ceil(viewport.height)
				canvas.width = Math.ceil(viewport.width)
				canvas.style = `width: ${
					Math.ceil(viewport.width) / (window.devicePixelRatio || 1)
				}px; height: ${Math.ceil(viewport.height) / (window.devicePixelRatio || 1)}px;`
				// Render PDF page into canvas context
				const renderContext = {
					canvasContext: context, // 内容
					viewport // 视口
				}
				const renderTask = page.render(renderContext) // 开始渲染
				renderTask.promise.then(() => {
					// 渲染完毕后的业务操作
					if (pageNumber === pageCount) {
						// proxy.$loading.hide()
					}
				})
			})
		}

		// 缩放pdf，这里是把原来的canvas删除重新按新的缩放倍数生成新的canvas
		const scalePDF = type => {
			if (type === 'add' && viewOption.scale === PDF_SCALE_MAX) {
				proxy.$tips({
					success: false,
					message: proxy.$t('contract.max')
				})
				return
			}
			if (type !== 'add' && viewOption.scale === PDF_SCALE_MIN) {
				proxy.$tips({
					success: false,
					message: proxy.$t('contract.min')
				})
				return
			}
			// proxy.$loading.show() // 可要可不要，如果速度快的话，就删掉吧，用户进入无感知
			// if (type === 'add') {
			// 	viewOption.scale = calculateOld.add(viewOption.scale, 0.2)
			// } else {
			// 	viewOption.scale = calculateOld.sub(viewOption.scale, 0.2)
			// }

			const parentNode = document.getElementById('canvasDiv')
			const canvasElements = document.getElementsByTagName('canvas')
			const pageCount = pdfView.value.numPages
			// 删除原有的canvas元素
			for (let i = canvasElements.length - 1; i >= 0; i--) {
				parentNode.removeChild(canvasElements[i])
			}
			// 重新生成
			for (let i = 1; i <= pageCount; i++) {
				addPage(i, pageCount)
			}
		}

		// 旋转PDF
		const roratePdf = () => {
			if (viewOption.rotation === 90) {
				viewOption.rotation = 0
			} else {
				viewOption.rotation = 90
				isRotate.value = true
			}
			const parentNode = document.getElementById('canvasDiv')
			const canvasElements = document.getElementsByTagName('canvas')
			const pageCount = pdfView.value.numPages
			// 删除原有的canvas元素
			for (let i = canvasElements.length - 1; i >= 0; i--) {
				parentNode.removeChild(canvasElements[i])
			}
			// 重新生成
			for (let i = 1; i <= pageCount; i++) {
				addPage(i, pageCount)
			}
		}

		const renderResize = () => {
			// 判断横竖屏
			const width = document.documentElement.clientWidth
			const height = document.documentElement.clientHeight
			if (width > height) {
				// 横屏, 需要去掉旋转， 放大缩小的按钮样式需要调整
				nextTick(() => {
					viewOption.rotation = 0
					const parentNode = document.getElementById('canvasDiv')
					const canvasElements = document.getElementsByTagName('canvas')
					const pageCount = pdfView.value.numPages
					// 删除原有的canvas元素
					for (let i = canvasElements.length - 1; i >= 0; i--) {
						parentNode.removeChild(canvasElements[i])
					}
					// 重新生成
					for (let i = 1; i <= pageCount; i++) {
						addPage(i, pageCount)
					}
				})
			}
		}

		const getPDF = url => {
			// const urlItem = 'https://github.com/mozilla/pdf.js/blob/master/examples/learning/helloworld.pdf'
			const cMapUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/cmaps/'
			// pdfData = atob(data); // 解码base64
			// url = url.includes(location.origin)
			// 	? url
			// 	: `/h5/api/file/downloadFile?url=${encodeURIComponent(url)}&type=view&number=number`
			PDF.getDocument({
				// data: pdfData,
				url: props.url,
				cMapUrl,
				cMapPacked: true
			}).promise.then(
				pdf => {
					pdfView.value = pdf // 缓存pdf文档，当用户缩放时不必再次请求数据
					const pageCount = pdf.numPages
					for (let i = 1; i <= pageCount; i++) {
						addPage(i, pageCount)
					}
				},
				err => {
					console.log(err)
					proxy.$tips({
						success: false,
						message: proxy.$t('contract.err') + '：' + err
					})
				}
			)
		}

		const getData = async () => {
			// proxy.$loading.show()
			const result = await Promise.all([
				import('pdfjs-dist'),
				import('pdfjs-dist/build/pdf.worker.mjs')
			])
			PDF = result[0]
			// PDF.GlobalWorkerOptions.workerSrc = result[1]
			getPDF(props.url)
		}

		// const setLang = () => {
		// 	const lang = proxy.$i18n.locale
		// 	if (lang === 'cn') proxy.$i18n.mergeLocaleMessage(lang, cnMap)
		// 	else proxy.$i18n.mergeLocaleMessage(lang, enMap)
		// }

		onMounted(() => {
			window.addEventListener('resize', renderResize, false)
		})

		onBeforeUnmount(() => {
			window.removeEventListener('resize', renderResize, false)
		})

		onBeforeMount(() => {
			// setLang()
			getData()
		})

		return {
			// pdfBase64,
			roratePdf,
			scalePDF
		}
	}
}
</script>

<style lang="scss" scoped>
.canvas-content {
	overflow: auto;
	text-align: center;
	canvas {
		border: 2px solid red;
	}
}
.ctrl {
	position: fixed;
	right: 10px;
	bottom: 10px;
	width: 24px;
	height: 90px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
}
.scale-btn {
	background: #e2e2e2;
	width: 24px;
	height: 24px;
	line-height: 24px;
	text-align: center;
	border-radius: 50%;
	z-index: 99;
	font-size: 24px;
	color: #323233;
}
</style>
