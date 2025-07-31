import React from 'react';
import { View, Text } from 'react-native';
import { CartesianChart, Line, Area } from 'victory-native';
import { Circle, LinearGradient, vec } from "@shopify/react-native-skia";

export function ToolTip({ x, y }) {
  return <Circle cx={x} cy={y} r={8} color="grey" opacity={0.8} />;
}

export default function FloatChart({ formattedFloatData, graphTitle, font, ttvalue, state, isActive, transformState }) {
  const yMax = Math.max(...formattedFloatData.map(d => d.value));
  const paddedYMax = yMax * 1.1; // Add 10% headroom

  return (
    <View style={{ height: 340 }}>
      {graphTitle !== '' && (
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {graphTitle.replace(/\./g, ' ').replace(/([A-Z])/g, ' $1').replace(/\b\w/g, l => l.toUpperCase()).trim()}
        </Text>
      )}
      <CartesianChart
        chartPressState={state}
        transform={transformState} 
        data={formattedFloatData}
        xKey="timestamp"
        yKeys={["value"]}
        domainPadding={{ bottom: 50, right: 15 }}
        xAxis={{
          font,
          labelRotate: -45,
          labelPosition: 'inset',
          formatXLabel: (label) =>
            new Date(label).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }).replace(/\s/g, ' '),
        }}
        yAxis={[
          {
            font,
            labelPosition: 'outset',
            domain: [0, paddedYMax],
          },
        ]}
      >
        {({ points, chartBounds }) => (
          <>
            <Area
              points={points.value}
              y0={chartBounds.bottom}
              animate={{ type: "timing", duration: 500 }}
            >
              <LinearGradient
                start={vec(chartBounds.left, chartBounds.top)}
                end={vec(chartBounds.left, chartBounds.bottom)}
                colors={["#ff000091", "#ff000000"]}
              />
            </Area>
            <Line
              points={points.value}
              color="red"
              strokeWidth={3}
              animate={{ type: "timing", duration: 500 }}
            />
            {isActive && (
              <ToolTip
                x={state.x.position}
                y={state.y.value.position}
              />
            )}
          </>
        )}
      </CartesianChart>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
        {ttvalue.value} @ {new Date(state.x?.value?.value || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </Text>
    </View>
  );
}