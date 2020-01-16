import React, { useGlobal } from 'reactn';
import Switch from 'react-switch';

export default function DarkModeSwitch(props) {
  const [darkMode, setDarkMode] = useGlobal('darkMode');
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className='mv2 ml3'>
      <label
        htmlFor='enableTrueDarkMode'
        className='flex flex-row justify-between items center'
      >
        <div className='f6'>True Dark Mode</div>
        <Switch
          height={23}
          onChange={toggleDarkMode}
          checked={darkMode}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor={'#00DFFC'}
          id='enableTrueDarkMode'
        />
      </label>
    </div>
  );
}
