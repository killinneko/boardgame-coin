import React from 'react';
import { Button } from '@mui/material';

// 残高を更新するボタンコンポーネント
const UpdateBalanceButton = ({ updateBalance }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={updateBalance}
      sx={{ marginTop: 2, width: '100%' }}
    >
      残高を更新
    </Button>
  );
};

export default UpdateBalanceButton;
