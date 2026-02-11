import api from "app/api/axios";

// 다중 이미지 업로드 함수
// 매개변수 필요 (이미지들, url값)

// 해당 페이지에서 사용할때 (다중)
// const imageList = await uploadMultiImages(files);


export const uploadMultiImages = async (files, url) => {
  const formData = new FormData();

  // 서버에서 array("images")로 받기 때문에 key = "images"
  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const res = await api.post(
    `/api/upload/multi/${url}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );


  return res.data.files;
};