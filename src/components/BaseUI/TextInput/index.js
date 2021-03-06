import React from 'react';
import {TextInput as BaseTextInput} from 'react-native';
import styles from './index.style';

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  focuse = () => {
    this.setState({focused: true});
  };

  blur = () => {
    this.setState({focused: false});
  };

  render() {
    const props = this.props;
    const {focused} = this.state;

    const defaultProps = {
      ...props,
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#adadad',
    };

    return (<BaseTextInput
      onFocus={this.focuse}
      onBlur={this.blur}
      {...defaultProps}
      style={[styles.textInput, props.style, (focused ? styles.focused : {})]}
    />);
  }
}
