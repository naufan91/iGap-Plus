import React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text as BaseText, View} from 'react-native';
import Text from './Text';
import {min} from 'lodash';
import Device from '../../../../modules/Responsive/Device';
import {gray700, primary} from '../../../../themes/default/index';
import {convertBytes} from '../../../../utils/filters';
import {prependFileProtocol} from '../../../../utils/core';
import MessageElement from './MessageElement';
import {IRANSans_Medium} from '../../../../constants/fonts/index';

const {width} = Device.dimensions.window;
const boxWidth = min([250, (0.7 * width)]);

export default class File extends MessageElement {

  render() {

    const {message, attachment, pickedFile, showText, smallThumbnailUri} = this.props;
    const uri = prependFileProtocol(smallThumbnailUri);

    const controlBar = this.renderControlBar(
      boxWidth,
      <View style={styles.thumbnail}>
        {uri && (<Image source={{uri: uri}} style={styles.thumbnail}/>)}
      </View>
      ,
      {
        completedIcon: 'save',
        completedIconSize: 30,
        renderProgressBar: false,
      }
    );

    return (
      <View style={styles.container}>
        <View style={styles.fileWrap}>
          {controlBar}

          <View style={styles.fileInfoWrap}>
            <BaseText numberOfLines={1} style={styles.fileName}>
              {attachment && attachment.getName() || pickedFile && pickedFile.fileName}
            </BaseText>
            <BaseText style={styles.fileSize}>
              {attachment && convertBytes(attachment.getSize().toNumber())}
            </BaseText>
            {this.renderProgressBar(boxWidth - 100, styles.progressStyle)}
          </View>
        </View>
        {(message && showText) ? (<Text showText={showText} message={message}/>) : null}
      </View>
    );
  }

}

File.propTypes = {
  message: PropTypes.string.isRequired,
  attachment: PropTypes.object.isRequired,
  showText: PropTypes.bool.isRequired,
  downloadedFile: PropTypes.object,
  smallThumbnailUri: PropTypes.string,
  waveformThumbnailUri: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: 250,
  },
  fileWrap: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  thumbnail: {
    width: 80,
    height: 70,
  },
  fileInfoWrap: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 5,
  },
  fileName: {
    ...IRANSans_Medium,
    fontSize: 14,
    color: primary,
  },
  fileSize: {
    fontSize: 12,
    color: gray700,
  },
  progressStyle: {
    marginTop: 10,
  },
});