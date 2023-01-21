import axios from 'axios';

const upload = (file, config, inputValues) => {
  const { title, content, targetPoint } = inputValues;
  const formData = new FormData();
  // for (const key of Object.keys(file)) {
  //   formData.append('file', file[key]);
  // }
  formData.append('file', file);
  formData.append('title', title);
  formData.append('content', content);
  formData.append('targetPoint', targetPoint);
  return axios.post('http://localhost:8080/서버_api', formData, config);
};

export default { upload };
