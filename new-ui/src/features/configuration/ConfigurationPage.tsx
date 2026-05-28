import React, { useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectConfig,
  selectCleanFinishedContainersSuccess,
  selectCleanFinishedContainersFailure,
  selectConfigError,
} from '../../store/config/configSelectors';
import {
  cleanFinishedContainers,
  cleanFinishedContainersSuccess as setCleanFinishedContainersSuccess,
  cleanFinishedContainersFailure as setCleanFinishedContainersFailure,
  getConfigFailure,
} from '../../store/config/configTypes';
import Page from '../../components/Page/Page';
import Card from '../../components/Card/Card';
import TitleInput from '../../components/TitleInput/TitleInput';
import ErrorDialog from '../../components/ErrorDialog/ErrorDialog';
import ConfigForm from './components/ConfigForm';
import styles from './ConfigurationPage.module.scss';

const ConfigurationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectConfig);
  const cleanContainersSuccess = useAppSelector(selectCleanFinishedContainersSuccess);
  const cleanContainersFailure = useAppSelector(selectCleanFinishedContainersFailure);
  const configError = useAppSelector(selectConfigError);

  const handleCleanContainers = useCallback(() => {
    dispatch(cleanFinishedContainers());
  }, [dispatch]);

  const handleCleanContainersSnackbarClose = useCallback(() => {
    dispatch(setCleanFinishedContainersSuccess(''));
  }, [dispatch]);

  const handleErrorClose = useCallback(() => {
    if (cleanContainersFailure) {
      dispatch(setCleanFinishedContainersFailure(''));
    }
    if (configError) {
      dispatch(getConfigFailure(''));
    }
  }, [dispatch, cleanContainersFailure, configError]);

  const currentError = cleanContainersFailure || configError;

  if (!config) {
    return null;
  }

  return (
    <Page title="Settings" description="Customize Predator behavior">
      <div className={styles.configurationPage}>
        <div className={styles.section}>
          <h1 className={styles.sectionTitle}>Configuration</h1>
          <Card className={styles.cardWrapper}>
            <ConfigForm />
          </Card>
        </div>

        <div className={styles.section}>
          <h1 className={styles.sectionTitle}>Housekeeping</h1>
          <Card className={styles.cardWrapper}>
            <div className={styles.housekeepingItem}>
              <TitleInput title="Clean up finished containers">
                <span />
              </TitleInput>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faTrashAlt}
                onClick={handleCleanContainers}
              />
            </div>
          </Card>
        </div>
      </div>

      <Snackbar
        open={!!cleanContainersSuccess}
        message={cleanContainersSuccess ? `${cleanContainersSuccess}` : ''}
        autoHideDuration={4000}
        onClose={handleCleanContainersSnackbarClose}
        ContentProps={{ style: { backgroundColor: '#2fbb67' } }}
      />

      {currentError && (
        <ErrorDialog showMessage={currentError} closeDialog={handleErrorClose} />
      )}
    </Page>
  );
};

export default ConfigurationPage;
