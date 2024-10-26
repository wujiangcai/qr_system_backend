package top.wujiangcai.springboot.database.controller;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import top.wujiangcai.springboot.database.util.OssUtil;


import java.util.HashMap;
import java.util.Map;

/**
 * @author dfysa
 * @data 2024/9/23 下午7:29
 * @description
 */
@RestController
@RequestMapping("/api/oss")
public class OssController {
    @Resource
    private OssUtil ossUtil;
    /**
     * 上传⽂件接⼝
     *
     * @param file ⽂件
     * @return 返回⽂件的URL
     */
    @PostMapping("/upload")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = ossUtil.uploadFile(file);
        Map<String, Object> response = new HashMap<>();
        response.put("fileUrl", fileUrl);
        return response;
    }
}
