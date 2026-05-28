import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface CollapsibleItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ title, children, defaultOpen = false }) => {
  return (
    <Accordion defaultExpanded={defaultOpen}>
      <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleItem;
