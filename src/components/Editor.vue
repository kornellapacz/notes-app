<template>
	<div
		ref="container"
		:style="{ minHeight: `${minHeight}px`, }"
		class="editor"
	>
		<textarea
			v-model="props.note.content"
			placeholder="Type something here..."
			class="bg-light"
			:style="{ width: showPreview ? '50%' : '100%', }"
		/>
		<div
			v-show="showPreview"
			v-html="html"
		/>
	</div>
	
	<teleport to="#navbar-settings">
		<input
			id="show-preview"
			v-model="showPreview"
			type="checkbox"
			class="btn-check"
			autocomplete="off"
		>
		<label
			:class="`btn btn-${showPreview ? 'primary' : 'secondary'} me-1`"
			for="show-preview"
		>
			<Icon />
		</label>
	</teleport>
</template>

<script setup>
// TODO: better table render
import {
	ref,
	onMounted,
	onUnmounted,
	computed,
	defineProps,
	watch,
	defineEmit,
} from 'vue';
import marked from 'marked';
import DOMPurify from 'dompurify';
import Icon from 'bootstrap-icons/icons/spellcheck.svg?component';

const showPreview = ref(true);

const container = ref(null);
const minHeight = ref(0);

const calculateMinSize = () => {
	minHeight.value = container.value.parentElement.clientHeight;
};

const emit = defineEmit(['save']);

const handleKeyDown = (event) => {
	if (!(event.key === 's' && event.ctrlKey)) {
		return;
	}

	event.preventDefault();
	emit('save');
};

onMounted(() => {
	window.addEventListener('resize', calculateMinSize);
	document.addEventListener('keydown', handleKeyDown);
	calculateMinSize();
});

onUnmounted(() => {
	window.removeEventListener('resize', calculateMinSize);
	document.removeEventListener('keydown', handleKeyDown);
});

const props = defineProps({
	note: Object,
});

const tokens = computed(() => marked.lexer(props.note.content));

watch(tokens, (value) => {
	const token = value.find(
		(token) => token.type === 'heading' && token.depth === 1,
	);

	props.note.title = token && token.text;
});

const html = computed(() => DOMPurify.sanitize(marked.parser(tokens.value)));
</script>

<style scoped>

.editor {
	display: flex;
	align-items: stretch;
}

.editor > * {
	box-sizing: border-box;
	padding: 1rem;
	width: 50%;
}

textarea {
	border: none;
	resize: none;
	outline: none;
	font-size: 14px;
	font-family: "Monaco", courier, monospace;
}
</style>
