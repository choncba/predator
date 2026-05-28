import React, { useState, useEffect, useCallback } from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Editor from '@monaco-editor/react';
import TitleInput from '../../../components/TitleInput/TitleInput';
import Input from '../../../components/Input/Input';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectCreateProcessorSuccess,
  selectProcessorsLoading,
} from '../../../store/processors/processorsSelectors';
import {
  CREATE_PROCESSOR,
  UPDATE_PROCESSOR,
  CLEAR_ALL_PROCESSORS_SUCCESS,
} from '../../../store/processors/processorsTypes';
import { Processor } from '../../../types/processor';

const DEFAULT_JAVASCRIPT = `module.exports = {
    beforeScenario,
    afterScenario,
    beforeRequest,
    afterResponse
};
function beforeScenario(context, ee, next) {
    return next(); // MUST be called for the scenario to continue
}
function afterScenario(context, ee, next) {
    return next(); // MUST be called for the scenario to continue
}
function beforeRequest(requestParams, context, ee, next) {
    return next(); // MUST be called for the scenario to continue
}
function afterResponse(requestParams, response, context, ee, next) {
    return next(); // MUST be called for the scenario to continue
}`;

interface ProcessorFormProps {
  data?: Processor;
  closeDialog: () => void;
}

const ProcessorForm: React.FC<ProcessorFormProps> = ({ data, closeDialog }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectProcessorsLoading);
  const createSuccess = useAppSelector(selectCreateProcessorSuccess);

  const [name, setName] = useState(data?.name ?? '');
  const [description, setDescription] = useState(data?.description ?? '');
  const [javascript, setJavascript] = useState(data?.javascript ?? DEFAULT_JAVASCRIPT);
  const [exportedFunctions, setExportedFunctions] = useState(
    data?.exported_functions?.join(', ') ?? ''
  );

  const editMode = !!data;

  useEffect(() => {
    if (createSuccess) {
      dispatch({ type: CLEAR_ALL_PROCESSORS_SUCCESS });
      closeDialog();
    }
  }, [createSuccess, closeDialog, dispatch]);

  const handleSubmit = useCallback(() => {
    const exportedFnArray = exportedFunctions
      .split(',')
      .map((fn) => fn.trim())
      .filter((fn) => fn.length > 0);

    if (editMode && data) {
      dispatch({
        type: UPDATE_PROCESSOR,
        payload: {
          id: data.id,
          body: { name, description, javascript, exported_functions: exportedFnArray },
        },
      });
    } else {
      dispatch({
        type: CREATE_PROCESSOR,
        payload: { name, description, javascript, exported_functions: exportedFnArray },
      });
    }
  }, [dispatch, editMode, data, name, description, javascript, exportedFunctions]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    setJavascript(value ?? '');
  }, []);

  return (
    <MuiDialog open onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{editMode ? 'Edit Processor' : 'Create Processor'}</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TitleInput title="Processor Name" style={{ width: '100%' }}>
            <Input value={name} onChange={setName} />
          </TitleInput>
          <TitleInput title="Description" style={{ width: '100%' }}>
            <Input value={description} onChange={setDescription} />
          </TitleInput>
          <TitleInput title="Exported Functions (comma separated)" style={{ width: '100%' }}>
            <Input
              value={exportedFunctions}
              onChange={setExportedFunctions}
              placeholder="e.g. beforeScenario, afterResponse"
            />
          </TitleInput>
          <TitleInput title="JavaScript" style={{ width: '100%' }}>
            <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
              <Editor
                height="400px"
                language="javascript"
                value={javascript}
                onChange={handleEditorChange}
                options={{
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: 'line',
                  automaticLayout: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </TitleInput>
        </div>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeDialog} color="primary" variant="outlined">
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!name || isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Submit'}
        </MuiButton>
      </DialogActions>
    </MuiDialog>
  );
};

export default ProcessorForm;
