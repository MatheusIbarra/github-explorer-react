import React from 'react';
import { Box } from '@mui/material';

import GithubLogo from 'src/assets/images/githubLogo.png';

const HeaderBanner: React.FC = () => {
  return (
    <Box
      width="100%"
      bgcolor="#0E1116"
      padding={2}
      style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
    >
      <img
        src={GithubLogo}
        alt="gitlogo"
        className="git-logo"
        style={{
          width: '20vh',
        }}
      />
    </Box>
  );
};

export default HeaderBanner;
