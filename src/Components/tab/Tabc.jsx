import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from './tab.css';


function Tabc({ tabs }) {
  return (
    <Tabs>
      <TabList className="tabs">
        {tabs.map((tab, index) => (
          <Tab key={index}>{tab.name}</Tab>
        ))}
      </TabList>

      {tabs.map((tab, index) => (
        <TabPanel key={index}>
          {typeof tab.content === 'function' ? tab.content() : tab.content}
        </TabPanel>
      ))}
    </Tabs>
  )
}

export default Tabc
