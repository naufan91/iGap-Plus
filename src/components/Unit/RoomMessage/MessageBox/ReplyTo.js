import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {FormattedMessage} from 'react-intl';
import ShortMessage from './ShortMessage';
import i18n from '../../../../i18n';
import {primary} from '../../../../themes/default/index';

/**
 * @param message {FlatRoomMessage}
 * @returns {XML}
 */
export default ({message}) => {
  return (
    <Text numberOfLines={1} style={styles.container}>
      <Text style={styles.replay}><FormattedMessage {...i18n.roomMessageReplyTo }/></Text>
      {' : '}
      <ShortMessage message={message}/>
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingLeft: 10,
    borderLeftColor: primary,
    borderLeftWidth: 3,
    marginBottom: 5,
  },
  replay:{
    color:'black',
  },
});