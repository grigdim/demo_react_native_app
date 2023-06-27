/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import { View, Text, SafeAreaView, processColor } from 'react-native';
import React, { useState } from 'react';
import { BarChart } from 'react-native-charts-wrapper';

const BarChartScreen = () => {
  const [selectedEntry, setSelectedEntry] = useState();
  const [selectedBarValue, setSelectedBarValue] = useState(null);
  const colorsArray = [
    'teal',
    'blue',
    'orange',
    'green',
    'red',
    'purple',
    'yellow',
    'pink',
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colorsArray.length);
    return processColor(colorsArray[randomIndex]);
  };

  const handleSelect = event => {
    if (event.nativeEvent == null) {
      setSelectedBarValue(null);
    } else {
      const selectedValue = event.nativeEvent.value;
      setSelectedBarValue(selectedValue);
    }
  };

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
    custom: {
      colors: [processColor('lightblue')],
      labels: ['Intale Profit'],
    },
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
          { y: 100, marker: 'a' },
          { y: 105 },
          { y: 102 },
          { y: 110 },
          { y: 114 },
          { y: 109 },
          { y: 105 },
          { y: 99 },
          { y: 95 },
          { y: 81 },
          { y: 87 },
          { y: 85 },
        ],
        label: 'Intale Profit',
        config: {
          colors: colorsArray.map(color => processColor(color)),
          barSpacePercent: 40,
          barShadowColor: processColor('lightgrey'),
          highlightAlpha: 90,
          highlightColor: processColor('black'),
          valueTextSize: 18,
          valueTextColor: processColor('black'),
        },
      },
    ],
    config: {
      barWidth: 0.7,
    },
  });
  const [highlights, setHighlights] = useState([{ x: 3 }, { x: 6 }]);
  const markerConfig = {
    enabled: true,
    markerColor: processColor('grey'),
    textColor: processColor('white'),
    textSize: 22,
    textStyle: {
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
  };
  const [xAxis, setXAxis] = useState({
    textSize: 18,
    textColor: processColor('black'),
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
      'Oct',
      'Nov',
      'Dec',
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
        style={{ width: '100%', height: '100%' }}
        data={data}
        xAxis={xAxis}
        animation={{ durationX: 1000 }}
        legend={legend}
        gridBackgroundColor={processColor('#ffffff')}
        visibleRange={{ x: { min: 7, max: 7 } }}
        drawBarShadow={false}
        drawValueAboveBar
        drawHighlightArrow
        onSelect={handleSelect}
        // onSelect={this.handleSelect.bind(this)}
        marker={markerConfig}
        highlights={highlights}
      // onChange={event => console.log(event.nativeEvent)}
      />
    </SafeAreaView>
  );
};

export default BarChartScreen;
