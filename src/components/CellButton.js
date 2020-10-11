import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'

const CellButton = (props) => {
    return (
        <button
            onClick={() => {props.clickHandler(props.CellModel)}}
            className={`GameButton ${props.CellModel.distance}`}/>
    )
}

CellButton.propTypes = {
    CellModel: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default CellButton
