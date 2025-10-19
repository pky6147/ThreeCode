package com.tc_back.img;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> allowed_extension = List.of("png");
    private static final long max_size = 8 * 1024 * 1024;


    @Override
    public String storeFile(MultipartFile file) {


        if (file.getSize() > max_size) {
            throw new RuntimeException( file.getOriginalFilename() +" 은(는) 8MB 초과합니다.");
        }


        Path folderPath = Paths.get(uploadDir /*+ dateFolder*/);

        try {
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }
            String OriginalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String extenstion = "";
            int dotIndex = OriginalFileName.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < OriginalFileName.length() - 1) {
                extenstion = OriginalFileName.substring(dotIndex + 1);
            }
            if ( !allowed_extension.contains(extenstion)) {
                throw new RuntimeException("png 만 첨부 가능합니다.");
            }

            String newFileName = UUID.randomUUID().toString() + "." + extenstion;
            Path targetPath = folderPath.resolve(newFileName);
            file.transferTo(targetPath.toFile());

            return newFileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        File file = new File(filePath);
        if(file.exists()) file.delete();
    }




}
