import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Button.css'

const CellButton = (props) => {

    const {cellData, setCellData} = useState(props)

    const clickHandler = () => {
        const newModel = cellData;
        newModel.distance = props.clickHandler(cellData);
        setCellData(newModel);
    };

    return (
        <button
            onClick={() => {setCellData(props.clickHandler(cellData))}}
            className={`GameButton ${cellData.distance}`}/>
    )
}

CellButton.propTypes = {
    CellModel: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default CellButton
