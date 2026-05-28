import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faVial, faClock, faChartLine, faMicrochip, faBolt, faLink, faCog } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  title: string;
  path: string;
  icon: IconDefinition;
}

export const getMenuItems = (featureToggles?: { CHAOS_MESH_ENABLED?: boolean }): MenuItem[] => {
  const items: MenuItem[] = [
    { title: 'Tests', path: '/tests', icon: faVial },
    { title: 'Scheduled Jobs', path: '/jobs', icon: faClock },
    { title: 'Last Reports', path: '/last_reports', icon: faChartLine },
    { title: 'Processors', path: '/processors', icon: faMicrochip },
    { title: 'Webhooks', path: '/webhooks', icon: faLink },
    { title: 'Settings', path: '/settings', icon: faCog },
  ];
  if (featureToggles?.CHAOS_MESH_ENABLED) {
    items.splice(4, 0, { title: 'Chaos Experiments', path: '/chaos_experiments', icon: faBolt });
  }
  return items;
};
