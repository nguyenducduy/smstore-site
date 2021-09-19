import Vue from 'vue';
import vueFilePond, { setOptions } from 'vue-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
);

setOptions({
  labelIdle: `Kéo thả hình hoặc <span class="filepond--label-action">Chọn</span>`,
  imagePreviewHeight: 100,
});


Vue.component(FilePond);