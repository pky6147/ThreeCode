import { Box, Typography } from "@mui/material";

interface ProductDetailImagesProps {
  images: string[]; // DB에서 가져온 파일명 배열
}

export default function ProductDetailImages({ images }: ProductDetailImagesProps) {
  if (!images || images.length === 0) {
    return <Typography>이미지 없음</Typography>;
  }

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {images.map((fileName, index) => {
        const url = `${import.meta.env.VITE_API_URL.replace("/api", "")}/images/${fileName}`;
        return (
          <Box key={index} sx={{ position: "relative" }}>
            {/* 대표이미지 표시 */}
            {index === 0 && (
              <Typography
                sx={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  backgroundColor: "red",
                  color: "white",
                  fontSize: 10,
                  px: 0.5,
                  borderRadius: 1,
                  zIndex: 1,
                }}
              >
                대표이미지
              </Typography>
            )}

            <img
              src={url}
              alt={fileName}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                border: index === 0 ? "2px solid red" : "1px solid #ccc",
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
