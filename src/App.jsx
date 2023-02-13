import "./App.css";
import { useEffect, useState, useCallback } from "react"; // useEffectとuseStateを使うための設定

//
const App = () => {
  return <Weather></Weather>;
};

//Weatherコンポーネントを作成
const Weather = () => {
  const [data, setData] = useState([]); //JSONで返ってきたデータを保存するためのもの
  const [loading, setLoading] = useState(true); //ローディング中か否かのフラグを設定する
  const [city, setcityCode] = useState(130000); //都市コード用、初期値は東京エリア
  //気象庁のサーバに天気情報のJSONを取得しにいくための関数
  const queryWeather = useCallback(async () => {
    //useCallback(第一引数, 第二引数)
    //第二引数の値[city]の値が変化したときのみ、コールバック内の関数が再実行される。useCallbackはビルトインフックの1つ
    const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${city}.json`;
    const response = await fetch(url);
    const jsondata = await response.json();
    //必要な部分のデータを上から順番に辿って指定する。JSONは階層構造になっている
    //console.log(jsondata[0].timeSeries[0].areas[0].weathers);

    // 必要なデータだけをsetData()で抜き出してステートに保存する
    setData(jsondata[0].timeSeries[0].areas[0]);
    setLoading(false);
  }, [city]);
  //selectが変わった時(onChangeイベント発生時)に実行される関数
  const handleChange = (event) => {
    setcityCode(event.target.value);
    setLoading(true);
  };
  useEffect(() => {
    // コンポーネントが描画されてから実行するためuseEffectを使用する
    queryWeather();
  }, [city, queryWeather]);
  let weatherInfo;
  // const summary = () => { document.style.display = none};
  const kishoURL = 'http://www.jma.go.jp/bosai/forecast/';
  //ここではif文を使っているが、三項演算子でもOK
  if (loading) {
    weatherInfo = <p>loading</p>;
  } else {
    weatherInfo = (
      <>
        <h2>{data.area.name}の明日の天気</h2>
        < ul >
          <li>{data.weathers[0]}</li>
          {/* <li>{data.link}</li> */}
        </ul >
        <details>
          <summary>もっと見る</summary>
          <dl>
            <dt>風向</dt>
            <dd>{data.winds[0]}</dd>
            <dt>風量</dt>
            <dd>{data.waves[0]}</dd>
            <dt></dt>
            <dd className="url"><a href={kishoURL}>詳しくはこちら</a></dd>
          </dl>
        </details>

      </>
    );
  }

  //最終的な出力のためのJSX
  return (
    <>
      <h1>Weather</h1>
      {weatherInfo}
      <select onChange={handleChange}>
        <option value="130000">東京</option>
        <option value="140000">千葉</option>
        <option value="270000">大阪</option>
        <option value="016000">札幌</option>
      </select>
    </>
  );
};

export default App;
