import { FaSpinner } from "react-icons/fa";

function SpinnerBit({className}) {
    return (
        <FaSpinner className={`loading-spinner ${className}`}/>
    );
}

export default SpinnerBit;