export const ImageDisplay = ({file}) => {
    if (file == null || file === "") {
        return null;
    }

    return (
        <div>
            <img alt={"test"} src={file} />
        </div>
    )
}
