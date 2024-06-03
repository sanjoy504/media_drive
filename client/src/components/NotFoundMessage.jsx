import mediaNotFoundImage from "../assets/images/media-notfound.avif"
export default function NotfoundMessage({ message= "No data found!" }) {
    return (
        <div className="w-full my-20 px-3">
          <img className="w-52 h-52 small-screen:w-40 small-screen:h-40 block ml-auto mr-auto" src={mediaNotFoundImage} alt="No document found" />
          <h3 className="text-gray-600 text-base small-screen:text-sm font-medium text-center">{message}</h3>
        </div>
    )
};
