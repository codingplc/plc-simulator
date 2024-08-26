import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';

import { Store } from '../../interface';
import { firestore } from '../../store/store';
import shareLink from './shareLink';
import { SET_DIAG_SAVED, OPEN_ALERT_SNACKBAR } from '../../store/types';
import { store } from '../../store/store';

import { ReactComponent as SvgShare } from '../../svg/share.svg';

import SvgButton from '../SvgButton';
interface Props {
  user: firebase.User;
}

const ShareButton: React.FC<Props> = (props: Props) => {
  const { user } = props;
  const diagramSaved = useSelector((state: Store) => state.temp.diagramSaved);
  const dispatch = useDispatch();
  const [shareDisable, setShareDisable] = useState(false);

  const share = () => {
    setShareDisable(true);
    setTimeout(() => setShareDisable(false), 3000);
    if (diagramSaved) return shareLink(document.URL);
    const { uid } = user;
    const state = store.getState() as unknown as Store;
    const { branches, elements, runglist, rungs, variables } = state;
    const diagram = { branches, elements, runglist, rungs, variables };
    const projectsRef = firestore.collection('projects_public').doc();
    const usersRef = firestore.collection('users').doc(user.uid);
    const batch = firestore.batch();
    const createdAt = firebase.firestore.Timestamp.now();
    batch.set(projectsRef, {
      createdAt,
      createdBy: uid,
      diagram,
    });
    batch.set(
      usersRef,
      {
        projects_public: firebase.firestore.FieldValue.arrayUnion({
          createdAt,
          id: projectsRef.id,
        }),
      },
      { merge: true },
    );
    batch
      .commit()
      .then(() => {
        window.history.pushState('', '', `/${projectsRef.id}`);
        shareLink(document.URL);
      })
      .then(() =>
        dispatch({
          type: SET_DIAG_SAVED,
          payload: {
            diagramSaved: true,
          },
        }),
      )
      .catch((error) => {
        dispatch({
          type: OPEN_ALERT_SNACKBAR,
          payload: {
            color: 'error',
            open: true,
            text: `Database saving error. ${error.message}`,
          },
        });
        console.error('Error adding document: ', error);
      });
  };

  return <SvgButton disabled={shareDisable} onClick={() => share()} Svg={SvgShare} />;
};

export default ShareButton;
