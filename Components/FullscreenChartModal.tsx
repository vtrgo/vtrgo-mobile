import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { createStyles } from '../styles';
import {
  CartesianChart,
  Line,
  Area,
} from 'victory-native'; // Adjust if needed
import {
  LinearGradient,
  vec,
  Text as SKText,
} from '@shopify/react-native-skia';
import ToolTip from './FloatChart'; // Confirm this points to your Tooltip component

const FullscreenChartModal = ({
  visible,
  onClose,
  theme,
  formattedFloatData,
  state,               // <-- Using parent's state here
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

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.FsmodalOverlay}>
        <View style={styles.modalContentFull}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>✖ Close</Text>
          </TouchableOpacity>

          {formattedFloatData?.length > 0 && (
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
              {({ points, chartBounds }) =>
                points?.value && chartBounds ? (
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

                    {typeof ttvalue === 'number' && (
                      <SKText
                        x={35}
                        y={215}
                        font={ttFont}
                        text={ttvalue.toFixed(2)}
                        color={'black'}
                        style={'fill'}
                      />
                    )}

                    {isActive && (
                      <ToolTip
                        x={state.x.position}
                        y={state.y.value.position}
                        leftBound={chartBounds.left}
                        rightBound={chartBounds.right}
                      />
                    )}
                  </>
                ) : null
              }
            </CartesianChart>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FullscreenChartModal;
