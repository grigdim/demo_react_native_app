/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {View, Text, SafeAreaView, processColor} from 'react-native';
import React, {useState} from 'react';
import {BarChart} from 'react-native-charts-wrapper';

const BarChartScreen = () => {
  const [selectedEntry, setSelectedEntry] = useState();
  const [legend, setLegend] = useState({
    enabled: true,
    textSize: 14,
    form: 'SQUARE',
    formSize: 14,
    xEntrySpace: 10,
    yEntrySpace: 5,
    formToTextSpace: 5,
    wordWrapEnabled: true,
    maxSizePercent: 0.5,
  });
  const [barNames, setBarNames] = useState([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
  ]);
  const [data, setDate] = useState({
    dataSets: [
      {
        values: [
          {y: 100, marker: 'a'},
          {y: 105},
          {y: 102},
          {y: 110},
          {y: 114},
          {y: 109},
          {y: 105},
          {y: 99},
          {y: 95},
        ],
        label: 'Hello World',
        config: {
          color: processColor('teal'),
          barShadowColor: processColor('lightgrey'),
          highlightAlpha: 90,
          highlightColor: processColor('red'),
        },
      },
    ],
    config: {
      barWidth: 0.7,
    },
  });
  const [highlights, setHighlights] = useState([{x: 3}, {x: 6}]);
  const [xAxis, setXAxis] = useState({
    valueFormatter: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
    ],
    granularityEnabled: true,
    granularity: 1,
  });

  // handleSelect(event) {
  //   const entry = event.nativeEvent
  //   if (entry == null) {
  //    setSelectedEntry(null)
  //   } else {
  //     setSelectedEntry(JSON.stringify(entry))
  //   }

  //   console.log(event.nativeEvent)
  // }

  return (
    <SafeAreaView>
      <BarChart
        style={{width: '100%', height: '100%'}}
        data={data}
        xAxis={xAxis}
        xValues={barNames}
        animation={{durationX: 1000}}
        legend={legend}
        gridBackgroundColor={processColor('#ffffff')}
        visibleRange={{x: {min: 5, max: 5}}}
        drawBarShadow={false}
        drawValueAboveBar
        drawHighlightArrow
        // onSelect={this.handleSelect.bind(this)}
        marker={{
          enabled: true,
        }}
        highlights={highlights}
        // onChange={event => console.log(event.nativeEvent)}
      />
    </SafeAreaView>
  );
};

export default BarChartScreen;
