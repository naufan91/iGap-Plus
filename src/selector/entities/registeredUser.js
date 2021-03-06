import {createSelector} from 'reselect';
import {FileDownload} from '../../modules/Proto/index';
import {FILE_MANAGER_DOWNLOAD_STATUS} from '../../constants/fileManager';
import {getUserId as getCurrentUserId} from '../../utils/app';

export const getUserId = (state, props) => {
  return props.userId || (props.navigation ? props.navigation.state.params.userId : null);
};

export const getUserFunc = createSelector(
  (state) => state.entities.registeredUsers,
  (registeredUsers) => (userId) => {
    return registeredUsers[userId];
  }
);

export const getUser = createSelector(
  getUserId,
  (state) => state.entities.registeredUsers,
  (userId, registeredUsers) => {
    return registeredUsers[userId];
  }
);

export const getCurrentUser = createSelector(
  (state) => state.entities.registeredUsers,
  (registeredUsers) => {
    return registeredUsers[getCurrentUserId(true)];
  }
);

export const getUserAvatar = createSelector(
  getUser,
  (state, props) => props.size,
  (user, size) => {
    if (!user) {
      return null;
    }

    let selector = null;
    let fileSelector = null;

    if (user.avatar) {
      if (size > 100 && user.avatar.file.getLargeThumbnail()) {
        selector = FileDownload.Selector.LARGE_THUMBNAIL;
        fileSelector = user.avatar.file.getLargeThumbnail();
      } else if (user.avatar.file.getSmallThumbnail()) {
        selector = FileDownload.Selector.SMALL_THUMBNAIL;
        fileSelector = user.avatar.file.getSmallThumbnail();
      }
    }

    return {
      color: user.color,
      initials: user.initials,
      avatar: fileSelector ? {
        token: user.avatar.file.getToken(),
        selector,
        size: fileSelector.getSize(),
        cacheId: fileSelector.getCacheId(),
        fileName: fileSelector.getName(),
      } : null,
    };
  }
);

export const getUserAvatarUri = createSelector(
  getUserAvatar,
  (state) => state.fileManager.download,
  (userAvatar, downloads) => {
    if (
      userAvatar
      &&
      userAvatar.avatar &&
      downloads[userAvatar.avatar.cacheId] &&
      downloads[userAvatar.avatar.cacheId].status === FILE_MANAGER_DOWNLOAD_STATUS.COMPLETED
    ) {
      return downloads[userAvatar.avatar.cacheId].uri;
    }
    return null;
  }
);

export const getUserTitle = createSelector(
  getUser,
  (user) => {
    return user ? {
      title: user.displayName,
      color: user.color,
    } : null;
  }
);