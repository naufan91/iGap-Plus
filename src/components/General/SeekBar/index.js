import React from 'react';
import PropTypes from 'prop-types';
import {
  gray950,
  primary,
} from '../../../themes/default/index';
import {
  Animated,
  StyleSheet,
  View,
  PanResponder,
  Easing,
} from 'react-native';

const _size = 24;
const styles = StyleSheet.create({
  container: {
    height: _size,
    backgroundColor: '#0000',
    marginTop: 3,
    marginBottom: 3,
  },
  background: {
    backgroundColor: gray950,
    height: 6,
    overflow: 'hidden',
    borderRadius: 2,
    marginTop: 9,
  },
  fill: {
    backgroundColor: primary,
    height: 6,
    borderRadius: 2,
  },
  circle: {
    width: _size,
    height: _size,
    borderRadius: _size / 2,
    backgroundColor: primary,
    position: 'absolute',
  },
});

class SeekBarComponent extends React.Component {
  state = {
    progress: new Animated.Value(this.props.progress || 0),
    isTouching: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.progress >= 0 && this.props.progress !== prevProps.progress && !this.state.isTouching) {
      this.update();
    }
  }

  goToPosition = (position, touchMode) => {
    let positionX = position - this.xPositionLayout;
    if (positionX < 0) {
      positionX = 0;
    }
    let value = 0;
    const {width, onSeek} = this.props;
    if (positionX !== 0 && width !== 0) {
      value = Number((Math.min(positionX, width) / width).toFixed(2));
    }
    switch (touchMode) {
      case 'start':
        this.setState({
          isTouching: true,
          progress: new Animated.Value(value),
        });
        this.lastPositionX = positionX;
        onSeek(value);
        break;
      case 'move':
        if (Math.abs(this.lastPositionX - positionX) > 3) {
          this.lastPositionX = positionX;
          this.setState({
            progress: new Animated.Value(value),
          });
          onSeek(value);
        }
        break;
    }

  };

  componentWillMount() {
    this.xPositionLayout = 0;
    this.onEnd = (evt, gestureState) => {
      if (this.state.isTouching) {
        this.setState({
          isTouching: false,
        });
      }
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: this.onEnd,
      onPanResponderTerminate: this.onEnd,
      onPanResponderEnd: this.onEnd,
      onPanResponderReject: this.onEnd,
      onPanResponderGrant: (evt, gestureState) => {
        this.goToPosition(gestureState.x0, 'start');
      },
      onPanResponderMove: (evt, gestureState) => {
        this.goToPosition(gestureState.moveX, 'move');
      },
    });
  }

  render() {
    const {width} = this.props;
    const fillWidth = {
      transform: [
        {
          translateX: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        },
      ],
    };
    const circleMove = {
      transform: [
        {
          translateX: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0 - _size, width - _size],
          }),
        },
      ],
    };

    return (
      <View {...this._panResponder.panHandlers} ref="Marker" style={styles.container} onLayout={(event) => {
        this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {
          this.xPositionLayout = pageX;
        });
      }}>
        <View style={[styles.background, {width: width}]}>
          <Animated.View style={[styles.fill, fillWidth]}/>
        </View>
        <Animated.View style={[styles.circle, circleMove]}/>
      </View>
    );
  }

  update() {
    Animated.timing(this.state.progress, {
      easing: Easing.linear,
      duration: 500,
      toValue: this.props.progress,
      useNativeDriver: true,
    }).start();
  }
}

SeekBarComponent.propTypes = {
  width: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  onSeek: PropTypes.func,
};

export default SeekBarComponent;