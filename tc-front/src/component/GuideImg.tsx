import { Box, Typography } from "@mui/material";

interface ProductDetailImagesProps {
  images: string[]; // DB에서 가져온 파일명 배열
}

export default function GuideImg({ images }: ProductDetailImagesProps) {
  if (!images || images.length === 0) {
    return <Typography>이미지 없음</Typography>;
  }

  const fileName = images[0]; // 0번째 이미지만 선택
  const url = `${import.meta.env.VITE_API_URL.replace("/api", "")}/images/${fileName}`;

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Typography
        sx={{
          position: "absolute",
          top: 4,
          left: 4,
          backgroundColor: "red",
          color: "white",
          fontSize: 12,
          px: 1,
          borderRadius: 1,
          zIndex: 1,
        }}
      >
        대표이미지
      </Typography>

      <img
        src={url}
        alt={fileName}
        style={{
          width: 400,      // 원하는 크기로 조절
          height: 400,
          objectFit: "contain",
          border: "3px solid red",
          borderRadius: 4,
        }}
      />
    </Box>
  );
}
