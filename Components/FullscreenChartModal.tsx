import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { createStyles } from '../styles';
import { CartesianChart, Line, Area } from 'victory-native';
import {
  LinearGradient,
  vec,
  Circle,
  Text as SkiaText,
  Group,
} from '@shopify/react-native-skia';

const FullscreenChartModal = ({
  visible,
  onClose,
  theme,
  formattedFloatData,
  state,
  transformState,
  font,
  ttFont,
  ttvalue,
  isActive,
}) => {
  if (!theme) {
    console.error('❌ FullscreenChartModal received undefined theme');
    return null;
  }

  const styles = createStyles(theme);

  const unwrap = (v) =>
    typeof v === 'object' && v !== null && 'value' in v ? v.value : v;

  const ToolTip = ({ x, y, xValRaw, yValRaw }) => {
    const xVal = typeof x === 'number' ? x : 0;
    const yVal = typeof y === 'number' ? y : 0;

    const timeLabel = xValRaw
      ? new Date(xValRaw).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : '--:--:--';

    const valueLabel =
      typeof yValRaw === 'number' ? yValRaw.toFixed(2) : '--';

    console.log(
      '🟡 ToolTip Render → x:',
      xVal,
      'y:',
      yVal,
      '| rawX:',
      xValRaw,
      'rawY:',
      yValRaw
    );

    return (
      <Group>
        <Circle cx={xVal} cy={yVal} r={8} color="grey" opacity={0.8} />
        <SkiaText
          x={xVal + 15}
          y={yVal - 10}
          text={`${timeLabel} | ${valueLabel}`}
          color="black"
          size={14}
        />
      </Group>
    );
  };

  const xPosRaw = state?.x?.position;
  const yPosRaw = state?.y?.value?.position;

  const xPos = unwrap(xPosRaw);
  const yPos = unwrap(yPosRaw);

  const xValRaw = state?.x?.value?.value;
  let yValRaw = state?.y?.value;
    if (yValRaw && typeof yValRaw === 'object') {
    if ('value' in yValRaw && typeof yValRaw.value === 'object') {
        yValRaw = yValRaw.value?.value;
    } else if ('value' in yValRaw) {
        yValRaw = yValRaw.value;
    }
    }


  const tooltipVisible =
    typeof xPos === 'number' && typeof yPos === 'number' && isActive;

  console.log('📊 FullscreenChartModal Debug:');
  console.log('🟠 xPos:', xPos, 'xValRaw:', xValRaw);
  console.log('🟠 yPos:', yPos, 'yValRaw:', yValRaw);
  console.log('🟠 isActive:', isActive);

  const timeLabel = xValRaw
    ? new Date(xValRaw).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--:--';

  const valueLabel =
    typeof yValRaw === 'number' ? yValRaw.toFixed(2) : '--';

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.FsmodalOverlay}>
        <View style={styles.modalContentFull}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>✖ Close</Text>
          </TouchableOpacity>

          {formattedFloatData?.length > 0 && (
            <>
              <CartesianChart
                chartPressState={state}
                transformState={transformState.state}
                data={formattedFloatData}
                xKey="timestamp"
                yKeys={['value']}
                domainPadding={{ bottom: 50, right: 15 }}
                xAxis={{
                  font,
                  labelRotate: -45,
                  labelPosition: 'inset',
                  enableRescaling: true,
                  formatXLabel: (label) =>
                    new Date(label)
                      .toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      .replace(/\s/g, ' '),
                }}
                yAxis={[
                  {
                    font,
                    labelPosition: 'outset',
                    domain: [0],
                  },
                ]}
                style={{ flex: 1, width: '100%' }}
              >
                {({ points, chartBounds }) => {
                  if (!points?.value || !chartBounds) return null;

                  return (
                    <>
                      <Area
                        points={points.value}
                        y0={chartBounds.bottom}
                        animate={{ type: 'timing', duration: 500 }}
                      >
                        <LinearGradient
                          start={vec(chartBounds.left, chartBounds.top)}
                          end={vec(chartBounds.left, chartBounds.bottom)}
                          colors={['#ff000091', '#ff000000']}
                        />
                      </Area>

                      <Line
                        points={points.value}
                        color="red"
                        strokeWidth={3}
                        animate={{ type: 'timing', duration: 500 }}
                      />

                      {tooltipVisible && (
                        <ToolTip
                          x={xPos}
                          y={yPos}
                          xValRaw={xValRaw}
                          yValRaw={yValRaw}
                        />
                      )}
                    </>
                  );
                }}
              </CartesianChart>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                {tooltipVisible
                  ? `${valueLabel} @ ${timeLabel}`
                  : 'Touch the chart to see values'}
              </Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FullscreenChartModal;
