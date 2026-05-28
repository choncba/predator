import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppConfig } from '../../types/config';
import { getMenuItems, MenuItem } from './menuConfig';
import { env } from '../../utils/env';
import styles from './NavigationDrawer.module.scss';

interface NavigationDrawerProps {
  children: React.ReactNode;
  config: AppConfig | null;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ children, config }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const featureToggles = useMemo(() => {
    if (!config) return undefined;
    return {
      CHAOS_MESH_ENABLED: Boolean(config['chaos_mesh_enabled']),
    };
  }, [config]);

  const menuItems = useMemo(() => getMenuItems(featureToggles), [featureToggles]);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const isActive = useCallback((path: string): boolean => {
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <Drawer
        variant="permanent"
        className={styles.drawer}
        classes={{ paper: styles.drawerPaper }}
      >
        <div className={styles.logoWrapper}>
          <span className={styles.logoText}>predator</span>
        </div>

        <List className={styles.menuList}>
          {menuItems.map((item: MenuItem) => (
            <div
              key={item.path}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.menuItemActive : ''}`}
              onClick={() => handleMenuClick(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMenuClick(item.path);
                }
              }}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.menuIcon} fixedWidth />
              <span className={styles.menuText}>{item.title}</span>
            </div>
          ))}
        </List>

        <div className={styles.bottomSection}>
          <span>v{env.VERSION}</span>
        </div>
      </Drawer>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export { NavigationDrawer };
export default NavigationDrawer;
