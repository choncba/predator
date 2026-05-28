import React, { useState, useCallback, useMemo } from 'react';
import { get, set } from 'lodash';
import Snackbar from '@mui/material/Snackbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectConfig,
  selectConfigUpdateSuccess,
  selectConfigUpdateError,
} from '../../../store/config/configSelectors';
import {
  updateConfig,
  cleanUpdateConfigSuccess,
  clearUpdateConfigError,
} from '../../../store/config/configTypes';
import { AppConfig } from '../../../types/config';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import TitleInput from '../../../components/TitleInput/TitleInput';
import UiSwitcher from '../../../components/UiSwitcher/UiSwitcher';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Tooltip from '../../../components/Tooltip/Tooltip';
import ErrorDialog from '../../../components/ErrorDialog/ErrorDialog';

const INPUT_TYPES = { SWITCHER: 'switcher', DROPDOWN: 'dropdown' } as const;

interface MenuInput {
  name: string;
  key: string;
  floatingLabelText: string;
  info?: string;
  type?: typeof INPUT_TYPES[keyof typeof INPUT_TYPES];
  valueType?: 'int' | 'float';
  secret?: boolean;
  disabled?: boolean;
  options?: string[];
  default?: string;
  inheritFromServerKeyObject?: string;
  isHidden?: (state: FormState) => boolean;
}

interface MenuCategory {
  category: string;
  inputs: MenuInput[];
}

type MenuItem = MenuInput | MenuCategory;

interface FormState {
  config: Record<string, unknown>;
  serverConfig: Record<string, unknown>;
}

function isCategory(item: MenuItem): item is MenuCategory {
  return 'category' in item;
}

const isMetricsDropdownHidden = (state: FormState, type: string): boolean => {
  const configValue = state.config.metrics_plugin_name as string | undefined;
  const serverValue = state.serverConfig.metrics_plugin_name as string | undefined;
  return configValue ? configValue !== type : (serverValue ? serverValue !== type : true);
};

const MENU: MenuItem[] = [
  {
    name: 'internal_address',
    key: 'internal_address',
    floatingLabelText: 'Internal address',
    info: 'The local ip address of your machine',
  },
  {
    name: 'runner_docker_image',
    key: 'runner_docker_image',
    floatingLabelText: 'Docker image name',
    info: 'The predator-runner docker image that will run the test',
  },
  {
    name: 'runner_cpu',
    key: 'runner_cpu',
    floatingLabelText: 'Runner CPU',
    info: 'The CPU allocated by each deployed runner',
    valueType: 'float',
  },
  {
    name: 'runner_memory',
    key: 'runner_memory',
    floatingLabelText: 'Runner memory (MB)',
    info: 'Max memory to use by each deployed runner',
    valueType: 'int',
  },
  {
    name: 'minimum_wait_for_delayed_report_status_update_in_ms',
    key: 'minimum_wait_for_delayed_report_status_update_in_ms',
    floatingLabelText: 'Minimum delayed time for report update (ms)',
    info: 'The minimum of time waiting for runner to report before the test is considered as finished',
    valueType: 'int',
  },
  {
    name: 'delay_runner_ms',
    key: 'delay_runner_ms',
    floatingLabelText: 'Delay runner (ms)',
    info: 'Delay the predator runner from sending http requests (ms)',
    valueType: 'int',
  },
  {
    name: 'interval_cleanup_finished_containers_ms',
    key: 'interval_cleanup_finished_containers_ms',
    floatingLabelText: 'Interval for clearing finished containers (ms)',
    info: 'Interval (in ms) to search and delete finished tests containers. Value of 0 means no auto clearing enabled',
    valueType: 'int',
  },
  {
    name: 'allow_insecure_tls',
    key: 'allow_insecure_tls',
    floatingLabelText: 'Allow insecure TLS',
    info: "If true, don't fail requests on unverified server certificate errors",
    type: INPUT_TYPES.SWITCHER,
  },
  {
    category: 'Benchmark',
    inputs: [
      {
        name: 'benchmark_threshold',
        key: 'benchmark_threshold',
        floatingLabelText: 'Threshold score',
        info: 'Minimum acceptable score of tests, if a score is less than this value, a webhook will be sent to the threshold webhook url',
        valueType: 'int',
      },
    ],
  },
  {
    category: 'Benchmark weights',
    inputs: [
      {
        name: 'percentile_ninety_five',
        key: 'benchmark_weights.percentile_ninety_five.percentage',
        floatingLabelText: 'p95',
        info: 'Percentage of the score affected by p95 results',
        inheritFromServerKeyObject: 'benchmark_weights',
        valueType: 'int',
      },
      {
        name: 'percentile_fifty',
        key: 'benchmark_weights.percentile_fifty.percentage',
        floatingLabelText: 'median',
        info: 'Percentage of the score affected by median results',
        inheritFromServerKeyObject: 'benchmark_weights',
        valueType: 'int',
      },
      {
        name: 'server_errors_ratio',
        key: 'benchmark_weights.server_errors_ratio.percentage',
        floatingLabelText: 'Server errors ratio',
        info: 'Percentage of the score affected by server errors ratio',
        inheritFromServerKeyObject: 'benchmark_weights',
        valueType: 'int',
      },
      {
        name: 'client_errors_ratio',
        key: 'benchmark_weights.client_errors_ratio.percentage',
        floatingLabelText: 'Client errors ratio',
        info: 'Percentage of the score affected by client errors ratio',
        inheritFromServerKeyObject: 'benchmark_weights',
        valueType: 'int',
      },
      {
        name: 'rps',
        key: 'benchmark_weights.rps.percentage',
        floatingLabelText: 'RPS',
        info: 'Percentage of the score affected by requests per second results',
        inheritFromServerKeyObject: 'benchmark_weights',
        valueType: 'int',
      },
    ],
  },
  {
    category: 'SMTP server',
    inputs: [
      {
        name: 'from',
        key: 'smtp_server.from',
        floatingLabelText: 'From',
        info: 'The address that is used as a FROM address when sending emails',
        inheritFromServerKeyObject: 'smtp_server',
      },
      {
        name: 'host',
        key: 'smtp_server.host',
        floatingLabelText: 'Host',
        info: 'SMTP server host',
        inheritFromServerKeyObject: 'smtp_server',
      },
      {
        name: 'username',
        key: 'smtp_server.username',
        floatingLabelText: 'Username',
        info: 'SMTP server username used for authentication',
        inheritFromServerKeyObject: 'smtp_server',
      },
      {
        name: 'password',
        key: 'smtp_server.password',
        floatingLabelText: 'Password',
        info: 'SMTP server password used for authentication',
        inheritFromServerKeyObject: 'smtp_server',
        secret: true,
      },
      {
        name: 'port',
        key: 'smtp_server.port',
        floatingLabelText: 'Port',
        info: 'SMTP server port',
        inheritFromServerKeyObject: 'smtp_server',
        valueType: 'int',
      },
      {
        name: 'timeout',
        key: 'smtp_server.timeout',
        floatingLabelText: 'Timeout',
        info: 'How many milliseconds to wait for the connection to establish to SMTP server',
        inheritFromServerKeyObject: 'smtp_server',
        valueType: 'int',
      },
    ],
  },
  {
    category: 'Metrics',
    inputs: [
      {
        name: 'metrics_plugin_name',
        key: 'metrics_plugin_name',
        floatingLabelText: 'Metrics plugin name',
        info: 'Select the metrics plugin to use',
        type: INPUT_TYPES.DROPDOWN,
        options: ['influx', 'prometheus'],
        default: 'None',
      },
      {
        name: 'push_gateway_url',
        key: 'prometheus_metrics.push_gateway_url',
        floatingLabelText: 'Prometheus push gateway url',
        info: 'Url of push gateway',
        inheritFromServerKeyObject: 'prometheus_metrics',
        isHidden: (state: FormState) => isMetricsDropdownHidden(state, 'prometheus'),
      },
      {
        name: 'host',
        key: 'influx_metrics.host',
        floatingLabelText: 'Influx host',
        info: 'Influx db host',
        inheritFromServerKeyObject: 'influx_metrics',
        isHidden: (state: FormState) => isMetricsDropdownHidden(state, 'influx'),
      },
      {
        name: 'username',
        key: 'influx_metrics.username',
        floatingLabelText: 'Influx username',
        info: 'Influx db username',
        inheritFromServerKeyObject: 'influx_metrics',
        isHidden: (state: FormState) => isMetricsDropdownHidden(state, 'influx'),
      },
      {
        name: 'password',
        key: 'influx_metrics.password',
        floatingLabelText: 'Influx password',
        info: 'Influx db password',
        inheritFromServerKeyObject: 'influx_metrics',
        secret: true,
        isHidden: (state: FormState) => isMetricsDropdownHidden(state, 'influx'),
      },
      {
        name: 'database',
        key: 'influx_metrics.database',
        floatingLabelText: 'Influx database',
        info: 'Influx db name',
        inheritFromServerKeyObject: 'influx_metrics',
        isHidden: (state: FormState) => isMetricsDropdownHidden(state, 'influx'),
      },
    ],
  },
];

const ConfigForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const serverConfig = useAppSelector(selectConfig);
  const updateSuccess = useAppSelector(selectConfigUpdateSuccess);
  const updateError = useAppSelector(selectConfigUpdateError);

  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>({});

  const menuFlatten = useMemo(
    () => MENU.flatMap((item) => (isCategory(item) ? item.inputs : [item])),
    []
  );

  const formState: FormState = useMemo(
    () => ({
      config: localConfig,
      serverConfig: (serverConfig as Record<string, unknown>) || {},
    }),
    [localConfig, serverConfig]
  );

  const onChangeField = useCallback((key: string, value: unknown) => {
    setLocalConfig((prev) => {
      const next = { ...prev };
      set(next, key, value);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const body: Record<string, unknown> = {};
    for (const item of menuFlatten) {
      const value = get(localConfig, item.key);
      if (value === undefined || value === '') {
        continue;
      }

      if (item.inheritFromServerKeyObject && !body[item.inheritFromServerKeyObject]) {
        body[item.inheritFromServerKeyObject] = {
          ...((serverConfig as Record<string, unknown> || {})[item.inheritFromServerKeyObject] as Record<string, unknown> || {}),
        };
      }

      switch (item.valueType) {
        case 'int': {
          const parsed = parseInt(String(value), 10);
          if (!isNaN(parsed)) {
            set(body, item.key, parsed);
          }
          break;
        }
        case 'float': {
          const parsed = parseFloat(String(value));
          if (!isNaN(parsed)) {
            set(body, item.key, parsed);
          }
          break;
        }
        default:
          set(body, item.key, value);
      }
    }

    // Clean empty objects
    const cleanedBody: Partial<AppConfig> = {};
    for (const key of Object.keys(body)) {
      const val = body[key];
      if (val === null || val === undefined) continue;
      if (typeof val === 'object' && Object.keys(val as object).length === 0) continue;
      cleanedBody[key] = val as string | boolean | number;
    }

    dispatch(updateConfig(cleanedBody));
  }, [dispatch, localConfig, menuFlatten, serverConfig]);

  const handleSnackbarClose = useCallback(() => {
    dispatch(cleanUpdateConfigSuccess());
  }, [dispatch]);

  const handleErrorClose = useCallback(() => {
    dispatch(clearUpdateConfigError());
  }, [dispatch]);

  const renderInfo = useCallback((item: MenuInput) => {
    if (!item.info) return null;
    return (
      <Tooltip content={item.info} placement="top">
        <span style={{ cursor: 'pointer', marginLeft: '8px' }}>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            style={{ color: '#557eff', fontSize: '13px' }}
          />
        </span>
      </Tooltip>
    );
  }, []);

  const renderInput = useCallback(
    (item: MenuInput, index: number) => {
      if (item.isHidden && item.isHidden(formState)) {
        return null;
      }

      const value = get(localConfig, item.key) ?? get(serverConfig as Record<string, unknown>, item.key) ?? '';

      return (
        <div key={`${item.key}-${index}`} style={{ marginBottom: '15px' }}>
          <TitleInput title={item.floatingLabelText}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                {item.type === INPUT_TYPES.SWITCHER && (
                  <UiSwitcher
                    activeState={Boolean(value)}
                    onChange={(val) => onChangeField(item.key, val)}
                  />
                )}
                {item.type === INPUT_TYPES.DROPDOWN && (
                  <Dropdown
                    value={String(value || '')}
                    onChange={(val) => onChangeField(item.key, val)}
                    options={(item.options || []).map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                  />
                )}
                {!item.type && (
                  <Input
                    value={String(value)}
                    onChange={(val) => onChangeField(item.key, val)}
                    type={item.secret ? 'password' : 'text'}
                    disabled={item.disabled}
                  />
                )}
              </div>
              {renderInfo(item)}
            </div>
          </TitleInput>
        </div>
      );
    },
    [formState, localConfig, serverConfig, onChangeField, renderInfo]
  );

  return (
    <div style={{ width: '100%' }}>
      {MENU.map((menuItem, index) => (
        <div key={index}>
          {isCategory(menuItem) && (
            <>
              <h3 style={{ marginTop: '0' }}>{menuItem.category}</h3>
              {menuItem.inputs.map((input, inputIndex) => renderInput(input, inputIndex))}
            </>
          )}
          {!isCategory(menuItem) && renderInput(menuItem, index)}
        </div>
      ))}

      <div style={{ marginTop: '16px' }}>
        <Button onClick={handleSubmit}>Save</Button>
      </div>

      {updateError && (
        <ErrorDialog showMessage={updateError} closeDialog={handleErrorClose} />
      )}

      <Snackbar
        open={updateSuccess}
        message="Configuration updated successfully"
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        ContentProps={{ style: { backgroundColor: '#2fbb67' } }}
      />
    </div>
  );
};

export default ConfigForm;
