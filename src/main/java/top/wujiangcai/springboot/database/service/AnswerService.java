package top.wujiangcai.springboot.database.service;

import org.springframework.stereotype.Service;
import top.wujiangcai.springboot.database.entity.Answer;

import java.util.List;

/**
 * @author dfysa
 * @data 2024/10/13 下午2:04
 * @description
 */
@Service
public interface AnswerService {
    List<Answer> findByQuestionId(Long relatedQuestionId); // 修改为 relatedQuestionId
    List<Answer> findByParentId(Long parentId);
    void addAnswer(Answer answer);
}
