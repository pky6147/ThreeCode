import { Box, Button, Typography } from "@mui/material";


export interface ProductImage {
  file: File;
  top: "Y" | "N";
}

interface ImgUpdateProps {
  images: ProductImage[];
  setImages: (imgs: ProductImage[]) => void;
}

export default function ImgUpdate({ images, setImages }: ImgUpdateProps) {
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      file,
      top: images.length + index === 0 ? "Y" : "N", // 첫 번째 이미지만 대표
    }));

    setImages([...images, ...newImages]);
  };

  // 리스트에서 취소 버튼 클릭
const handleCancelImage = (index: number) => {
  setImages(images.filter((_, i) => i !== index));
};

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {images.map((img, index) => (
        <Box key={index}>
          <img
            src={URL.createObjectURL(img.file)}
            alt={`img-${index}`}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              border: img.top === "Y" ? "2px solid blue" : "1px solid #ccc",
            }}
          />
          
   
        <Typography sx={{ fontSize: 12 }}>{img.file.name}</Typography>
          <Button size="small" onClick={() => handleCancelImage(index)}>
            취소
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
      </Box>
    </Box>
  );
}
