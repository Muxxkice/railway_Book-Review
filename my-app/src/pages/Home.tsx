import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Header from "../compornent/Header";

import { getReview, postBooklog, fetchMore } from "../api/BookApi";
import { setDefaultHeader } from "../api/index";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { bookId, setBook } from "../store/booksSlice";
import { userIsAuth, isToken, userToken } from "../store/userSlice";
import { BookType } from "../type/ReviewType";
import "./home.scss";

export const Home = () => {
  const dispatch = useAppDispatch();
  const [count, setCount] = useState<number>(0);
  const [isbooks, setisbooks] = useState(false);
  const [cookies] = useCookies<string>(["Token"]);

  const [books, setBooks] = useState<Array<BookType>>([]);
  const [offset, setOffset] = useState<number>(10); //offsetのカウント
  const [isend, setIsend] = useState<boolean>(false); //本の配列の最後かどうか
  const navigate = useNavigate();

  const isAuth = useAppSelector((state) => state.user.isAuth);
  const reviews = useAppSelector((state) => state.posts.book);
  const istoken = useAppSelector((state) => state.user.isToken);

  useEffect(() => {
    if (isAuth && istoken) {
      setDefaultHeader(cookies.Token);
    } else {
      dispatch(userIsAuth(false));
      dispatch(userToken(""));
      dispatch(isToken(false));
    }
  }, [cookies]);

  useEffect(() => {
    (async () => {
      const res = await getReview();
      if (res !== null) {
        dispatch(setBook(res));
        setisbooks(true);
      } else {
        setisbooks(false);
      }
    })();
  }, []);
  // プロミスでやる。
  // 即時関数使わない(調べる)

  // if (reviews === null) return <></>;

  const onClickFetchMore = async () => {
    const res = await fetchMore(offset);
    setOffset(offset + res.length);
    setBooks([...books, ...res]);
    dispatch(setBook([...books, ...res]));
    if (res.length < 10) {
      setIsend(true);
    }
  };

  return (
    <main>
      <Header />
      <h1>レビュ一覧</h1>
      {isbooks ? (
        <>
          {reviews.map((booklog: BookType) => {
            return (
              <div key={booklog.id} className="booklog-container">
                <div className="booklog-container__book-item">
                  <p>タイトル</p>
                  <p className="booklog-container__book-item--title">
                    <a href={booklog.url}>{booklog.title}</a>
                  </p>
                  <p>説明</p>
                  <p>{booklog.detail}</p>
                </div>
                <div className="booklog-container__review-item">
                  <p>レビュー</p>
                  <p>{booklog.review}</p>
                  <p>レビュワー</p>
                  <p>{booklog.reviewer}</p>
                </div>
                <button
                  className="booklog-container__button"
                  onClick={() => {
                    dispatch(bookId(booklog.id));
                    postBooklog(booklog.id);
                    navigate(`detail/${booklog.id}`);
                  }}
                >
                  詳細
                </button>
              </div>
            );
          })}
          <button
            className="booklog-container__button"
            onClick={onClickFetchMore}
          >
            もっとみる
          </button>
        </>
      ) : (
        "ログインしてください"
      )}
    </main>
  );
};

export default Home;
