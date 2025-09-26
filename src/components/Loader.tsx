import { RotatingLines } from "react-loader-spinner";

function Loader({ width = '96' }) {
    return (
        <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width={width}
            visible={true}
        />
    )
}

export default Loader