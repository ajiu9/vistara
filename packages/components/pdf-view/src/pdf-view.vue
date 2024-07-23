<template>
	<div id="canvasDiv" class="canvas-content">
		<div class="ctrl" :class="{ 'ctrl-rotate': 'isRotate' }">
			<div class="scale-btn" @click="roratePdf">
				<i class="iconfont icon-xuanzhuan"></i>
			</div>
			<div class="scale-btn" @click="scalePDF('add')">
				<span>＋</span>
			</div>
			<div class="scale-btn" @click="scalePDF">
				<span>－</span>
			</div>
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

let PDF
import Big from 'big.js'
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
				// proxy.$tips({
				// 	success: false,
				// 	message: proxy.$t('contract.max')
				// })
				return
			}
			if (type !== 'add' && viewOption.scale === PDF_SCALE_MIN) {
				// proxy.$tips({
				// 	success: false,
				// 	message: proxy.$t('contract.min')
				// })
				return
			}
			// proxy.$loading.show() // 可要可不要，如果速度快的话，就删掉吧，用户进入无感知
			if (type === 'add') {
				viewOption.scale = new Big(viewOption.scale).plus(0.2)
			} else {
				viewOption.scale = new Big(viewOption.scale).minus(0.2)
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
			const cMapUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/cmaps/'
			PDF.getDocument({
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
		onMounted(() => {
			window.addEventListener('resize', renderResize, false)
		})

		onBeforeUnmount(() => {
			window.removeEventListener('resize', renderResize, false)
		})

		onBeforeMount(() => {
			getData()
		})

		return {
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
