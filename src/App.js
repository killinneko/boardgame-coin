import React from 'react'; 
import BalanceConnectButton from './components/BalanceDisplay';
import ERC20BalanceDisplay from './components/ERC20BalanceDisplay'; 

const App = () => {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>ボードゲームコインDAppへようこそ</h1>
      <BalanceConnectButton />
      <ERC20BalanceDisplay />
    </div>
  );
};

export default App;
