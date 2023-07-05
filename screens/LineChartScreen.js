/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, SafeAreaView, processColor, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {LineChart} from 'react-native-charts-wrapper';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';

const LineChartScreen = () => {
  const token = useSelector(selectToken);
  useEffect(() => {
    console.log('====================================');
    console.log(token);
    console.log('====================================');
  }, [token]);

  return (
    <SafeAreaView className="flex-1 justify-center align-center">
      <LineChart
        className="mx-auto"
        style={{width: '80%', height: '60%'}}
        chartDescription={{
          text: 'Line Chart Demo',
          textColor: processColor('#f593f3'),
          textSize: 100,
        }}
        drawGridBackground={false}
        legend={{
          text: 'Line Chart',
          horizontalAlignment: 'CENTER',
          textSize: 100,
        }}
        borderWidth={1}
        drawBorders
        autoScaleMinMaxEnabled={false}
        touchEnabled
        dragEnabled
        scaleEnabled
        scaleXEnabled
        scaleYEnabled
        pinchZoom
        doubleTapToZoomEnabled
        highlightPerTapEnabled
        highlightPerDragEnabled={false}
        dragDecelerationEnabled
        dragDecelerationFrictionCoef={0.99}
        data={{
          dataSets: [
            {
              values: [
                {x: 4, y: 135},
                {x: 5, y: 2.88},
                {x: 6, y: 0.77},
                {x: 7, y: 105},
              ],
              label: 'A',
              config: {color: processColor('blue'), valueTextSize: 15},
            },
            {
              values: [
                {x: 4, y: 105},
                {x: 5, y: 90},
                {x: 6, y: 130},
                {x: 7, y: 100},
              ],
              label: 'B',
              config: {color: processColor('green'), valueTextSize: 15},
            },
            {
              values: [
                {x: 4, y: 110},
                {x: 5, y: 110},
                {x: 6, y: 105},
                {x: 7, y: 115},
              ],
              label: 'C',
              config: {color: processColor('red'), valueTextSize: 15},
            },
          ],
        }}
        keepPositionOnRotation={false}
        marker={{
          enabled: true,
          digits: 2,
          markerColor: processColor('lightblue'),
          textColor: processColor('midnightblue'),
          textSize: 25,
          textStyle: {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontStyle: 'italic',
          },
        }}
        xAxis={{
          // drawGridLines: false,
          granularityEnabled: true,
          // avoidFirstLastClipping: true,
          granularity: 1,
          axisLineWidth: 2,
          textColor: processColor('#ff6u79'),
          textSize: 12,
        }}
        yAxis={{
          left: {
            textColor: processColor('#ff6u79'),
            textSize: 12,
            axisLineWidth: 2,
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: 150,
            gridDashedLine: {lineLength: 5, spaceLength: 5},
            gridColor: processColor('#c1c9c4'),
          },
          right: {enabled: false},
        }}
      />
    </SafeAreaView>
  );
};

export default LineChartScreen;
