import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Button.css'

const CellButton = (props) => {

    const {cellModel} = useState(props)

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
