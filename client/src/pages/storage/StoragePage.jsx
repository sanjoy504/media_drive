import { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function StoragePage() {

  const [progress, setProgress] = useState(18);

  return (
    <>
      <div className="my-2">
        <div className="text-xl text-gray-900 font-bold">Storage use</div>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              progress,
            )}%`}</Typography>
          </Box>
        </Box>
      </div>

      <div className="text-4xl flex gap-6">
        <div>
          <i className="bi bi-image-fill text-gray-600"></i>
          <div className="text-base text-center">12%</div>
        </div>
        <div>
          <i className="bi bi-filetype-pdf text-red-600"></i>
          <div className="text-base text-center">6%</div>
        </div>
      </div>
    </>
  )
}

export default StoragePage;