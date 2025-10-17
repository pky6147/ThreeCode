import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

// DTO 타입 정의
export interface ProductDto {  
  companyId: number;
  productName: string;
  productCode: string;
  paintType: string;
  category: string;
  color: string;
  price: number;
  isActive: string;
  remark: string;
  routingIds: number[]; // 선택된 라우팅 스텝 ID 배열
  images?: ProductImage[]; // 이미지 배열
}

export interface ProductImage {
  file: File;
  top: "Y" | "N";
  productImgId?: number; // 수정 시 기존 이미지 ID
}

// 제품 등록 (FormData 사용)
export const createProduct = async (product: ProductDto) => {
  const formData = new FormData();

  formData.append("companyId", String(product.companyId));
  formData.append("productName", product.productName);
  formData.append("productNo", product.productCode);
  formData.append("paintType", product.paintType);
  formData.append("category", product.category);
  formData.append("color", product.color);
  formData.append("price", String(product.price));
  formData.append("isActive", product.isActive);
  formData.append("remark", product.remark);

  // ✅ routingStepsJson 대신 FormData로 펼쳐서 전송
  product.routingIds.forEach((id, index) => {
    formData.append(`routingSteps[${index}].routingMasterId`, String(id));
  });

  // 이미지 파일 추가
  if (product.images) {
    product.images.forEach((img) => {
      formData.append("images", img.file);
    });
  }

  const res = await axios.post(`${BASE_URL}/product`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 제품 수정 (ID 기반)
// export const updateProduct = async (productId: number, product: ProductDto) => {
//   const formData = new FormData();

//   formData.append("companyId", String(product.companyId));
//   formData.append("productName", product.productName);
//   formData.append("productCode", product.productCode);
//   formData.append("paintType", product.paintType);
//   formData.append("category", product.category);
//   formData.append("color", product.color);
//   formData.append("price", String(product.price));
//   formData.append("isActive", product.isActive);
//   formData.append("remark", product.remark);

//   product.routingIds.forEach((id) => formData.append("routingIds", String(id)));

//   if (product.images) {
//     product.images.forEach((img, idx) => {
//       formData.append("images", img.file);
//       formData.append(`top[${idx}]`, img.top);
//       if (img.productImgId) formData.append(`productImgId[${idx}]`, String(img.productImgId));
//     });
//   }

//   const res = await axios.put(`${BASE_URL}/products/${productId}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return res.data;
// };
