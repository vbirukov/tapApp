import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Button.css'

const CellButton = (props) => {

    const {cellModel, setCellData} = useState(props)

    const clickHandler = () => {
        const newModel = cellModel;
        newModel.distance = props.clickHandler(cellModel);
        setCellData(newModel);
    };

    return (
        <button
            onClick={() => {setCellData(props.clickHandler(cellModel))}}
            className={`GameButton ${cellModel.distance}`}/>
    )
}

CellButton.propTypes = {
    CellModel: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default CellButton
