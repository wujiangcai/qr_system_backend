package top.wujiangcai.springboot.database.service;

import org.springframework.stereotype.Service;
import top.wujiangcai.springboot.database.entity.Answer;
import top.wujiangcai.springboot.database.entity.Question;
import top.wujiangcai.springboot.database.entity.User;

import java.util.List;

/**
 * @author dfysa
 * @data 2024/10/12 下午10:35
 * @description
 */
@Service
public interface UserService {
    User login(String username, String password);
    void register(User user);
    String generateToken(User user);
    // 新增方法声明
    User getUserById(int userId);

    List<Question> getQuestionsByUserId(int userId);
    List<Answer> getAnswersByUserId(int userId);
    void updateUserInfo(User user);
    void updateAvatar(int userId, String avatarUrl);
    // 新增方法声明：验证用户密码
    boolean verifyPassword(int userId, String inputPassword);

//    boolean verifyCode(String email, String code);
//    void sendVerificationCode(String email);
}
