import React from 'react';
import {View} from 'react-native';
import {Toolbar} from 'react-native-material-ui';
import SoundPlayer from '../../../containers/Unit/SoundPlayer';
import {SOUND_PLAYER_BOX_TOOLBAR} from '../../../constants/app';
import ConnectionStatus from '../../../containers/Unit/ConnectionStatus';

export default (props) => {
  return (
    <View>
      <Toolbar {...props}/>
      <ConnectionStatus showAuthenticating={props.showAuthenticating}/>
      <SoundPlayer type={SOUND_PLAYER_BOX_TOOLBAR}/>
    </View>
  );
};