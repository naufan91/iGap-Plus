import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import * as _ from 'lodash';
import {Spinner} from '../index';

class Form extends Component {
  inputs = {};

  constructor(props) {
    super(props);
    const {control} = this.props;
    this.recursiveCloneChildren = this.recursiveCloneChildren.bind(this);
    control({
      submit: this.submit,
      validate: this.validate,
      setValue: this.setValue,
      loadingOn: this.loadingOn,
      loadingOff: this.loadingOff,
      setError: this.setError,
    });
  }

  setValue = (name, val) => {
    const inputs = this.inputs;
    if (inputs[name]) {
      inputs[name].setValue(val);
    }
  };

  setError = (name, error) => {
    const inputs = this.inputs;
    if (inputs[name]) {
      inputs[name].setError(error);
    }
  }

  submit = () => {
    const output = {};
    const inputs = this.inputs;
    return this.validate().then(function() {
      Object.keys(inputs).forEach(function(name) {
        output[name] = inputs[name].getValue();
      });
      return Promise.resolve(output);
    });
  };

  loadingOn = () => {
    this.loading.on();
  };

  loadingOff = () => {
    this.loading.off();
  };

  validate = () => {
    const inputs = this.inputs;
    let promises = [];
    Object.keys(inputs).forEach(function(key) {
      promises.push(inputs[key].validate());
    });
    return Promise.all(promises);
  };

  render() {
    const wrappedChildren = this.recursiveCloneChildren(this.props.children);
    return (
      <View {...this.props}>
        {wrappedChildren}
        <Spinner control={(loading) => {
          this.loading = loading;
        }}/>
      </View>
    );
  }


  recursiveCloneChildren(children) {
    return React.Children.map(children, child => {

      if (!_.isObject(child)) {
        return child;
      }

      let childProps = {...child.props};
      if (child.props.isField) {
        childProps.control = (input) => {
          this.inputs[child.props.name] = input;
        };
      }

      childProps.children = this.recursiveCloneChildren(child.props.children);
      return React.cloneElement(child, childProps);
    });
  }
}

Form.propTypes = {
  control: PropTypes.func.isRequired,
};

export default Form;