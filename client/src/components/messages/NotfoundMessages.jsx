import mediaNotFoundImage from "../../assets/images/media-notfound.avif"
function NotfoundMessages({ message }) {
    return (
        <div className="w-full my-20">
          <img className="w-52 h-52 small-screen:w-40 small-screen:h-40 block ml-auto mr-auto" src={mediaNotFoundImage} alt="No document found" />
          <h2 className="text-gray-600 text-2xl small-screen:text-xl font-semibold text-center">{message}</h2>
        </div>
    )
}

export default NotfoundMessages
