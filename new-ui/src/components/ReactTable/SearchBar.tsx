import React, { useState, useCallback } from 'react';
import styles from './ReactTable.module.scss';

interface SearchBarProps {
  onSearch: (value: string) => void;
  searchSections?: React.ReactNode[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchSections }) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onSearch(newValue);
    },
    [onSearch]
  );

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={handleChange}
        className={styles.searchInput}
      />
      {searchSections && searchSections.map((section, index) => (
        <React.Fragment key={index}>{section}</React.Fragment>
      ))}
    </div>
  );
};

export default SearchBar;
