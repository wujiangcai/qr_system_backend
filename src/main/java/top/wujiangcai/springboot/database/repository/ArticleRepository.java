package top.wujiangcai.springboot.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import top.wujiangcai.springboot.database.entity.Article;

/**
 * @author dfysa
 * @data 8/10/2024 下午1:59
 * @description
 */

public interface ArticleRepository extends JpaRepository<Article,Long> {

}
