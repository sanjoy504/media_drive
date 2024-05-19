import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getUserData } from '../../context/User/getUserData';
import { Button } from '@mui/material';

function StoragePage() {

  const { storageDetails, storage_limit } = getUserData();

  const { storageUseInTypes, totalUsedStorage, totalPercentageUsed } = storageDetails || {}

  const progress = parseFloat(totalPercentageUsed?.replace('%', ''));

  const { pdf, image } = storageUseInTypes || {};

  return (
    <>
      <div className="my-2">

        <div className="w-full flex items-center justify-between">
          <div>
            <div className="text-xl small-screen:text-base text-balance text-gray-900 font-bold">Storage use details</div>
            <small className="text-gray-700 font-medium">Total {totalUsedStorage} use out of {storage_limit}</small>
          </div>
         <button type="button" className="bg-green-600 text-gray-50 text-center text-[11px] font-semibold p-2 shadow-md rounded-sm mx-3">
          Upgrade storage
         </button>
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{totalPercentageUsed || '0 %'}</Typography>
          </Box>
        </Box>
      </div>

      <div className="text-4xl flex gap-5">
        <div className="flex flex-col items-center gap-2 px-2">

          <i className="bi bi-image-fill text-gray-600"></i>
          <div>
            <div className="text-center text-xs text-gray-600 font-medium">{image?.size || "0 KB"}</div>
            <div className="text-base text-center">{image?.percentageUse || "0%"}</div>
          </div>

        </div>

        <div className="flex flex-col items-center gap-2 px-2">
          <i className="bi bi-filetype-pdf text-red-600"></i>
          <div>
            <div className="text-center text-xs text-gray-600 font-medium">{pdf?.size || "0 KB"}</div>
            <div className="text-base text-center">{pdf?.percentageUse || "0%"}</div>
          </div>

        </div>
      </div>
    </>
  )
}

export default StoragePage;