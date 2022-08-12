import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import WidgetBlock from "@Component/WidgetBlock";
import MapSVG from "@Component/MapSVG";

import "./style.scss";
import { useSelector } from "react-redux";

const MainPage = () => {
  const { selectedCity, selectedRegion } = useSelector((state: RootState) => ({
    selectedCity: state.selectedCity,
    selectedRegion: state.selectedRegion,
  }));
  const [riverLevelDataState, setRiverLevelData] = useState<RiverLevelSeoulAPIResonse | null>(null);
  const [selectedCityState, setSelectedCity] = useState<string>(selectedCity);
  const [selectedRegionState, setSelectedRegion] = useState<Region | null>(selectedRegion);

  const { t } = useTranslation(["article", "region"]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://openAPI.seoul.go.kr:8088/${process.env["REACT_APP_RIVER_LEVEL_SEOUL_API_KEY"]}/json/ListRiverStageService/1/1000`,
    }).then(res => {
      (res.data as RiverLevelSeoulAPIResonse).ListRiverStageService.row.forEach(itm => {
        itm.RIVER_NAME = itm.RIVER_NAME.trim();
      });
      setRiverLevelData(res.data);
    });
  }, []);

  useEffect(() => {
    setSelectedCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    setSelectedRegion(selectedRegion);
  }, [selectedRegion]);

  return (
    <>
      <WidgetBlock
        icon={"🔍"}
        title={`${t("article:ARTICLE_WIDGET_TITLE_MAIN_GRAPH")} (${new Date()})`}
      >
        {riverLevelDataState ? (
          <>
            <MapSVG riverData={riverLevelDataState} selectedCityName={selectedCityState} />
            <div className="info">
              <div className="info-color">
                <div className="info-color-riverlevel">
                  <div className="text min">100%</div>
                  <div className="icon"></div>
                  <div className="text max">30%</div>
                  <div className="text title">
                    {t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_1")} (%)
                  </div>
                </div>
                <div className="info-color-no-data">
                  <div className="icon"></div>
                  <div className="text title">{t("article:ARTICLE_MAIN_GRAPH_INFO_TITLE_2")}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <img style={{ display: "block", margin: "auto" }} src="loading-spin.gif" alt="" />
        )}
      </WidgetBlock>
      <div className="sub-articles">
        <WidgetBlock
          icon={"📊"}
          title={`${
            selectedRegionState ? t(`region:REGION_${selectedRegionState.guName}`) : ""
          } ${t("article:ARTICLE_WIDGET_TITLE_DETAIL_GRAPH")}`}
        >
          <h1>준비중입니다.</h1>
        </WidgetBlock>
        <WidgetBlock icon={"📰"} title={"News"}>
          <h1>준비중입니다.</h1>
        </WidgetBlock>
      </div>
    </>
  );
};

export default MainPage;