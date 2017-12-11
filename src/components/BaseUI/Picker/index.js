import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {FlatList, Icon, Modal, TextInput} from '../index';
import styles from './index.styles';
import PropTypes from 'prop-types';

class Picker extends React.Component {
  state = {
    selectedKey: false,
  };
  _onSelectItem = (key) => {
    this.props.onItemSelect(key);
    this.setState({selectedKey: key});
    this.modal.close();
  };

  render() {
    let {selectedKey} = this.state;
    const {placeHolder, options, defaultValue, headerTitle, searchable} = this.props;
    let {style} = this.props;
    let defaultSelected = defaultValue;
    if (!defaultSelected) {
      defaultSelected = selectedKey;
    }
    const selectedItem = options.find(function(option) {
      return option.key === defaultSelected;
    });
    const selectTitle = selectedItem ? selectedItem.value : placeHolder;
    if (!style) {
      style = {};
    }
    return (
      <View style={[styles.wrapper, style.wrapper]}>
        <TouchableOpacity onPress={() => {
          this.modal.open(true);
        }} style={[styles.touchable, style.touchable]}>
          <View style={[styles.touchableView, style.touchableView]}>
            <View style={[styles.selectBox, style.selectBox]}>
              <Text style={[styles.selectText, style.selectText]}>
                {selectTitle}
              </Text>
            </View>
            <View style={[styles.selectIcon, style.selectIcon]}>
              <Icon name="expand-more"/>
            </View>
          </View>
        </TouchableOpacity>
        <Modal control={(modal) => {
          this.modal = modal;
        }}>
          <SelectListModal searchable={searchable} headerTitle={headerTitle} options={options}
            onSelectItem={this._onSelectItem}/>
        </Modal>
      </View>
    );
  }
}

class SelectListModal extends React.Component {
  state = {
    searchText: '',
  };

  render() {
    const {onSelectItem, searchable, headerTitle} = this.props;
    const {searchText} = this.state;
    const options = this.props.options.filter(function(option) {
      return searchText === '' || option.filter.search(searchText.toLowerCase()) >= 0;
    });
    return (
      <View style={styles.container}>
        <View style={styles.headerWrap}>

          {headerTitle ? (<Text style={styles.headerTitle}>{headerTitle}</Text>) : null}

          {searchable ? (
            <View style={styles.searchWrap}>
              <View style={styles.searchIcon}>
                <Icon name="search" size={26} color="#aaaaaa"/>
              </View>
              <TextInput style={styles.searchInput} autoFocus={true} underlineColorAndroid="transparent"
                onChangeText={(text) => {
                  this.setState({searchText: text});
                }}/>
            </View>
          ) : null}

        </View>
        <View style={styles.bodyWrap}>
          <FlatList
            data={options}
            renderItem={({item}) =>
              (<TouchableOpacity key={item.key} onPress={() => {
                onSelectItem(item.key);
              }}>
                {item.element}
              </TouchableOpacity>)}/>
        </View>
      </View>

    );
  }
}

Picker.propTypes = {
  placeHolder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  onItemSelect: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    element: PropTypes.element.isRequired,
  })).isRequired,
  searchable: PropTypes.bool,
  headerTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};


export default Picker;