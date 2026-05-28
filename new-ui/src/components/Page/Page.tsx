import React from 'react';
import classnames from 'classnames';
import styles from './Page.module.scss';

interface PageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Page: React.FC<PageProps> = ({ title, description, children, className }) => {
  return (
    <div className={classnames(className, styles.page)}>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}
        {children}
      </div>
    </div>
  );
};

export default Page;
