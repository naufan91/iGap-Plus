/**
 * @flow
 */
import {
  METHOD_SIGNALING_CLEAR_LOG,
  METHOD_SIGNALING_LOG_LIST,
} from '../../../actions/methods/signaling/callLog';

export function callLog(state = [], action) {
  switch (action.type) {
    case METHOD_SIGNALING_LOG_LIST:
      const newState = {...state};
      for (const item of action.logList) {
        newState[item.id] = {
          id: item.id,
          peerId: item.peerId,
          duration: item.duration,
          offerTime: item.offerTime,
          status: item.status,
          type: item.type,
        };
      }
      return newState;
    case METHOD_SIGNALING_CLEAR_LOG:
      const clearState = {...state};
      const clearId = action.clearId;
      for (const id in clearState) {
        if (id <= clearId) {
          delete clearState[id];
        }
      }
      return clearState;
    default:
      return state;
  }
}