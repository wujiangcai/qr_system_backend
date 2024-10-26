package top.wujiangcai.springboot.database.controller;

import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.wujiangcai.springboot.database.common.ResponseResult;
import top.wujiangcai.springboot.database.mapper.SpecialMapper;

/**
 * @author dfysa
 * @data 2024/10/12 下午4:43
 * @description
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/zhihu")
public class SpecialController {
    @Resource
    private SpecialMapper specialMapper;
    @GetMapping("/specials")
    public ResponseResult getSpecials(){
        return ResponseResult.builder()
                .code(200)
                .msg("数据获取成功")
                .data(specialMapper.findAll())
                .build();
    }
}