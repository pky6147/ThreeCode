import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export interface ProductImage {
  file?: File;           // 새로 업로드한 파일
  url?: string;          // 기존 이미지 URL
  top: "Y" | "N";        // 대표 이미지 여부
  productImgId?: number; // 기존 이미지 ID
}

interface ImgUpdateProps {
  images: ProductImage[];
  setImages: (imgs: ProductImage[]) => void;
}

export default function ImgUpdate({ images, setImages }: ImgUpdateProps) {
  // 새로운 파일 추가
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 이미 대표 이미지가 있는지 체크
    const hasTop = images.some(img => img.top === "Y");

    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      file,
      top: hasTop ? "N" : index === 0 ? "Y" : "N",
    }));

    setImages([...images, ...newImages]);
  };

  // 이미지 취소/삭제
  const handleCancelImage = (index: number) => {
    const removed = images[index];
    setImages(images.filter((_, i) => i !== index));

    // 대표 이미지를 삭제했을 경우, 첫 번째 이미지로 top 설정
    if (removed.top === "Y" && images.length > 1) {
      setImages(prev => {
        const updated = [...prev];
        if (updated[0]) updated[0].top = "Y";
        return updated;
      });
    }
  };

  // 이미지 클릭 시 대표 이미지로 변경
  const handleSetTop = (index: number) => {
    setImages(prev =>
      prev.map((img, i) => ({
        ...img,
        top: i === index ? "Y" : "N",
      }))
    );
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {images.map((img, index) => (
        <Box key={index} sx={{ textAlign: "center" }}>
          <img
            src={img.file ? URL.createObjectURL(img.file) : img.url}
            alt={`img-${index}`}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              border: img.top === "Y" ? "2px solid blue" : "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={() => handleSetTop(index)}
          />
          <Typography sx={{ fontSize: 12 }}>
            {img.file?.name || `기존 이미지 ${index + 1}`}
          </Typography>
          <Button size="small" onClick={() => handleCancelImage(index)}>
            삭제
          </Button>
        </Box>
      ))}

      <Box>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddImage}
          style={{ display: "block", marginTop: 10 }}
        />
        <Typography sx={{ fontSize: 12, mt: 1 }}>
          처음 이미지가 대표이미지
        </Typography>
      </Box>
    </Box>
  );
}
