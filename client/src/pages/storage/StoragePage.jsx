
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { getUserData } from '../../context/User/getUserData';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));


export default function StoragePage() {

  const { storageDetails, storage_limit } = getUserData();

  const { storageUseInTypes, totalUsedStorage, totalPercentageUsed } = storageDetails || {}

  const progress = parseFloat(totalPercentageUsed?.replace('%', ''));

  const { pdf, image, video, audio } = storageUseInTypes || {};

  return (
    <div className="px-2.5">
      <div className="my-2">

        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl small-screen:text-base text-balance text-gray-900 font-bold">Storage use details</h2>
          <button type="button" className="bg-green-600 text-gray-50 text-center text-[11px] font-semibold p-2 shadow-md rounded-sm mx-3">
            Upgrade storage
          </button>
        </div>

        <div className="flex flex-col">
          <small className="text-gray-700 font-medium">Total {totalUsedStorage.replace('Byte', 'KB')} use out of {storage_limit}</small>
          <div className="flex items-center h-auto">
            <div className="w-full mr-1">
              <BorderLinearProgress variant="determinate" value={progress} />
            </div>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{totalPercentageUsed || '0 %'}</Typography>
            </Box>
          </div>
        </div>

      </div>

      <section className="w-full h-auto my-5">
        <h5 className="text-base small-screen:text-sm text-balance text-gray-800 font-bold my-1.5">Files use details</h5>
        <div className="text-4xl flex flex-row overflow-x-scroll gap-5 scrollbar-hidden">

          { /**** Images Detaile **** */}
          <FileDetailsCard title="Images" icon="image-fill" iconColor="blue-600" size={image?.size || "0 KB"} percentage={image?.percentageUse || "0%"} />

          { /**** PDF files Detaile **** */}
          <FileDetailsCard title="PDF files" icon="filetype-pdf" iconColor="red-600" size={pdf?.size || "0 KB"} percentage={pdf?.percentageUse || "0%"} />

          { /**** Video files Detaile **** */}
          <FileDetailsCard title="Video files" icon="filetype-mp4" iconColor="blue-600" size={video?.size || "0 KB"} percentage={video?.percentageUse || "0%"} />

          { /**** Audio files Detaile **** */}
          <FileDetailsCard title="Audio files" icon="file-earmark-music" iconColor="purple-600" size={audio?.size || "0 KB"} percentage={audio?.percentageUse || "0%"} />

        </div>
      </section>
    </div>
  )
};

function FileDetailsCard({ title, icon, iconColor, size, percentage }) {
  return (
    <div className="w-auto h-auto flex flex-col space-y-2 items-center py-2 px-5 border border-slate-200 shadow-sm rounded-md">
      <div className="flex items-center gap-2">
        <i className={`bi ${'bi-' + icon} ${'text-' + iconColor}`}></i>
        <div className="text-nowrap text-sm font-medium">
          <div className="text-gray-700">{size.replace('Byte', 'kB')}</div>
          <div className="text-gray-600">{percentage}</div>
        </div>
      </div>
      <div className="text-gray-900 text-xs font-semibold text-center">{title}</div>
    </div>
  )
};
