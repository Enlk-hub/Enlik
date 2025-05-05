import { useNews } from "../service/NewsContext";
import NewsEventsCalendar from "./NewsEventsCalendar";
import Collection from "./Collection/Collection";
import Component2 from "./Left_Block/Component2";
import Component3 from "./Left_Block/Component3";
import Component4 from "./Right_Block/Component4";
import PropTypes from "prop-types";
import "./RevolutionBanner.css";

function RevolutionBanner({ className = "" }) {
  const { loading, news } = useNews();

  if (loading) {
    return <div>Loading news content...</div>;
  }

  // Если новостей нет, возвращаем заглушку
  if (!news || news.length === 0) {
    return <div>No news available</div>;
  }

  // Функция для определения коротких новостей
  const isShortNews = (newsItem) =>
    newsItem.description.length < 100 && newsItem.title.length < 30;

  // Отсортируем новости по длине описания для более предсказуемого распределения
  const sortedNews = [...news].sort((a, b) => a.description.length - b.description.length);
  
  // Создадим список уникальных идентификаторов новостей для каждого компонента
  const usedNewsIds = new Set();
  
  // Функция для получения уникальной новости
  const getUniqueNewsId = () => {
    // Сначала пытаемся найти короткую новость, которая еще не использовалась
    for (const item of sortedNews) {
      if (!usedNewsIds.has(item.id) && isShortNews(item)) {
        usedNewsIds.add(item.id);
        return item.id;
      }
    }
    
    // Если коротких уникальных новостей нет, берем любую неиспользованную
    for (const item of sortedNews) {
      if (!usedNewsIds.has(item.id)) {
        usedNewsIds.add(item.id);
        return item.id;
      }
    }
    
    // В крайнем случае, если новостей меньше чем нужно компонентов, 
    // возвращаем первую новость (такое не должно случаться при достаточном количестве новостей)
    return sortedNews[0]?.id || 1;
  };

  // Получаем уникальные ID для NewsEventsCalendar (свайпер)
  const swiperNewsIds = [];
  for (let i = 0; i < 3; i++) {
    swiperNewsIds.push(getUniqueNewsId());
  }
  
  // Получаем уникальные ID для остальных компонентов
  const component2NewsId = getUniqueNewsId();
  const component3NewsId = getUniqueNewsId();
  const component4NewsId = getUniqueNewsId();

  return (
    <section className={`revolution-banner ${className}`}>
      <div className="news-block-container">
        <div className="twitter-name">
          <NewsEventsCalendar newsIds={swiperNewsIds} />
        </div>

        <div className="collection-block">
          <Collection collectionId={1} />

          <div className="side-news-block1">
            <div className="side-news-container1">
              <div className="side-news-content2">
                <Component2 newsId={component2NewsId} />
                <Component3 newsId={component3NewsId} />
              </div>

              <div className="main-side-news">
                <Component4 newsId={component4NewsId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

RevolutionBanner.propTypes = {
  className: PropTypes.string,
};

export default RevolutionBanner;