import api from "app/api/axios";

// 단일 이미지 업로드 함수
// 매개변수 필요 (이미지, url값)

// 해당 페이지에서 사용할때 (단일)
// const profileUrl = await uploadSingleImage(file);

export const uploadSingleImage = async (file, url) => {
  const formData = new FormData();

  // 서버에서 single("image")로 받기 때문에 key = "image"
  formData.append("image", file);

  const res = await api.post(
    `/api/upload/single/${url}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );


  return res.data.url;
};