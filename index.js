/**
 * @flow
 */
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';
import 'core-js/es6/map';

import {AppRegistry} from 'react-native';
import Root from './src/containers/Root';


AppRegistry.registerComponent('iGapPlus', () => Root);