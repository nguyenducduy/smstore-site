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
  imagePreviewHeight: 150,
  server: {
    url: 'http://localhost:7000',
    process: {
      url: '/process',
      method: 'POST',
      withCredentials: false,
      onerror: (response) => {
        console.log(response);
      }
    }
  }
});


Vue.component(FilePond);