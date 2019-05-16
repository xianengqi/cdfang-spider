import * as React from 'react';
import * as _ from 'lodash';
import { Layout, Tabs } from 'antd';

import { RouteComponentProps } from 'react-router';
import util from '../utils/index';
import ChartPanel from '../components/ChartPanel/index';
import WholeTable from '../components/WholeTable';
import StatisticCard from '../components/StatisticCard/past';
import BasicColumnGraph from '../components/BasicColumnGraph';
import { AppContext } from '../context/appContext';
import * as constants from '../constants';

const { useContext } = React;
const { Content } = Layout;
const { TabPane } = Tabs;

const PastYear: React.FunctionComponent<RouteComponentProps> = () => {
  const appState = useContext(AppContext);
  const { allData } = appState;

  const changeTab = (activityKey: string): void => {
    appState.changeActivityKey(activityKey);
  };

  const areasGroup = _.groupBy(allData, (item: cdFang.IhouseData) => item.area);
  const areasList = Object.keys(areasGroup);
  const tabpanels = util.sortArea(areasList).map((item: string) => (
    <TabPane tab={item} key={item}>
      <ChartPanel
        data={areasGroup[item]}
        panelKey={item}
        activityKey={appState.activityKey}
      />
    </TabPane>
  ));

  // 柱状图数据
  const { chartHouseData, chartBuilderData } = util.getBasicColumnGraphData(
    appState.allData
  );

  return (
    <Content className="content">
      {appState.allData.length > 0 ? <StatisticCard /> : ''}
      <div className="content-graph-bar">
        <Tabs defaultActiveKey={appState.activityKey} onChange={changeTab}>
          {tabpanels}
        </Tabs>
      </div>
      <div className="content-basic-column">
        <div className="content-basic-column-title">整体统计</div>
        <BasicColumnGraph
          title="房源数排序图"
          data={chartHouseData}
          xAxis={constants.AREA}
          yAxis={constants.HOUSE_NUMBER}
          desc
        />
        <BasicColumnGraph
          title="楼盘数排序图"
          data={chartBuilderData}
          xAxis={constants.AREA}
          yAxis={constants.BUILDER_NUMBER}
          desc
        />
      </div>
      <div className="content-graph-table">
        <WholeTable />
      </div>
    </Content>
  );
};

export default PastYear;
